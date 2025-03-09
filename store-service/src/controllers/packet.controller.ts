import response from '@helpers/response.helper'
import { Request, Response } from 'express'
import dbConnection from '@datasources/connection'
import NotFoundException from '@exceptions/not-found.exception'
import Packet from '@datasources/models/packet.model'

class PacketController {

  async reserve(req: Request, res: Response) {
    const t = await dbConnection.transaction()
    try {
      if(!req.body.foodId) throw new NotFoundException("Please provide the food to reserve");
      const packet = await Packet.findOne({
        where: {
          foodId: req.body.foodId,
          isReserved: false,
          orderId: null
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      })
      if(!packet) throw new NotFoundException("Out of stock");
      packet.isReserved = true;
      await packet.save({transaction: t})
      await t.commit()
      return response.success(req, res)
    } catch (err: any) {
      t.rollback();
      return response.failed(
        req,
        res,
        err.message,
        null,
        err.httpCode
      )
    }
  }

  async book(req: Request, res: Response) {
    const t = await dbConnection.transaction()
    try {
      if(!req.body.orderId) throw new NotFoundException("Please provide order id to book.")
      if(!req.body.foodId) throw new NotFoundException("Please provide food id to book.")
        const packet = await Packet.findOne({
          where: {
            foodId: req.body.foodId,
            isReserved: true,
            orderId: null
          },
          transaction: t,
          lock: t.LOCK.UPDATE
        })
        if(!packet) throw new NotFoundException("Out of stock");
        packet.isReserved = false;
        packet.orderId = req.body.orderId;
        await packet.save({transaction: t})
        await t.commit();
      return response.success(req, res)
    } catch (err: any) {
      t.rollback();
      return response.failed(
        req,
        res,
        err.message,
        null,
        err.httpCode
      )
    }
  }

}

export default new PacketController()
