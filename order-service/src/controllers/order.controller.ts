import response from '@helpers/response.helper'
import axios from 'axios'
import { Request, Response } from 'express'
import crypto from 'crypto'
import Order, { OrderStatus } from '@datasources/models/order.model';
import dbConnection from '@datasources/connection';

class OrderController {

  async create(req: Request, res: Response) {
    try {
        let orders = []
        for(let i=0;i<10;i++) {
            const order = this.process();
            orders.push(order)
        }

        orders = await Promise.allSettled(orders)

        return response.success(req,res, orders)
    } catch (err: any) {
    console.log(err.httpCode)
      return response.failed(
        req,
        res,
        "Unable to process the order at the moment",
        null,
        err.httpCode || 503
      )
    }
  }

  async process() {
    const t = await dbConnection.transaction();
    let order = {} as Order;
    try {
        const orderId = crypto.randomUUID();
        order = await Order.create({
            orderId,
            status: 'INITIAL',
        }, {transaction: t})
        await axios.post("http://localhost:8000/v1/packets/reserve", {
            foodId: 1
        });
        await axios.post("http://localhost:8001/v1/agents/reserve");

        await axios.post("http://localhost:8000/v1/packets/book", {
            orderId,
            foodId: 1
        });

        await axios.post("http://localhost:8001/v1/agents/book", {
            orderId
        });

        order.status = OrderStatus.SUCCESS;
        await order.save({transaction: t});
        await t.commit();
        return order;
    } catch (error) {
        if(order?.id) {
            order.status = OrderStatus.FAILED;
            await order.save({transaction: t});
            t.commit();
        } else t.rollback();
        throw error;
    }
  }

}

export default new OrderController()
