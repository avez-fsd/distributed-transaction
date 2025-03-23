import { OrderCreatedEvent, OrderFailedEvent } from "src/interfaces/orders.interface";
import Agent from "@datasources/models/agent.model";
import dbConnection from "@datasources/connection";
import NotFoundException from "@exceptions/not-found.exception";
import { KAFKA_EVENTS } from "@constants";
import KafkaService from ".";
import { Op } from "sequelize";

export async function handleOrderCreatedEvent(event: OrderCreatedEvent) {
    const t = await dbConnection.transaction()
    const order = event.payload.order;
    try {
        
        const agent = await Agent.findOne({
            where: {
                [Op.or]: [
                    { isReserved: true,
                        orderId: order.orderId },
                    { isReserved: false,
                        orderId: null }
                ],
            },
            order: [
                ['isReserved', 'DESC']
            ],
            transaction: t,
            lock: t.LOCK.UPDATE
          })
        
        if(!agent) throw new NotFoundException("Delivery Agent Not Available.");
        if(agent.isReserved && agent.orderId !== null) {
            await t.commit();
            return;
        };
        agent.isReserved = true;
        agent.orderId = order.orderId;
        await agent.save({transaction: t})
        await t.commit()
        KafkaService.produceEvent({
            eventType: KAFKA_EVENTS.AGENT_ASSIGNED,
            key: agent?.id?.toString() ?? '',
            payload: {
                agent,
                order
            }
        })
    } catch (error:any) {
        t.rollback();
        KafkaService.produceEvent({
            eventType: KAFKA_EVENTS.AGENT_ASSIGN_FAILED,
            key: order.orderId,
            payload: {
                order: event.payload.order,
                failureReason: error.message
            }
        })
        console.error('Error handling order created event:', error);
    }
}

export async function handleOrderFailed(event: OrderFailedEvent) {
    const t = await dbConnection.transaction()
    const order = event.payload.order;
    try {
        const agent = await Agent.findOne({
            where: {
              isReserved: true,
              orderId: order.orderId
            },
            transaction: t,
            lock: t.LOCK.UPDATE
          })
        
        if(!agent) {
            await t.commit()
            return;
        }

        agent.isReserved = false;
        agent.orderId = null;
        await agent.save({transaction: t})
        await t.commit()
        
    } catch (error:any) {
        t.rollback();
        console.error('Error handling order failed event:', error);
    }
}