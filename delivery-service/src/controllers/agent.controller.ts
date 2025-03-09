import response from '@helpers/response.helper'
import { Request, Response } from 'express'
import dbConnection from '@datasources/connection'
import NotFoundException from '@exceptions/not-found.exception'
import Agent from '@datasources/models/agent.model'

class AgentController {

  async reserve(req: Request, res: Response) {
    const t = await dbConnection.transaction()
    try {
      const agent = await Agent.findOne({
        where: {
          isReserved: false,
          orderId: null
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      })
      if(!agent) throw new NotFoundException("Delivery Agent Not Available.");
      agent.isReserved = true;
      await agent.save({transaction: t})
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
      if(!req.body.orderId) throw new NotFoundException("Please provide order id to book an agent.")
        const agent = await Agent.findOne({
          where: {
            isReserved: true,
            orderId: null
          },
          transaction: t,
          lock: t.LOCK.UPDATE
        })
        if(!agent) throw new NotFoundException("Delivery Agent Not Available");
        agent.isReserved = false;
        agent.orderId = req.body.orderId;
        await agent.save({transaction: t})
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

export default new AgentController()
