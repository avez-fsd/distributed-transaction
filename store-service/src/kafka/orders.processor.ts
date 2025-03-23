import { OrderCreatedEvent, OrderFailedEvent } from "src/interfaces/orders.interface";
import dbConnection from "@datasources/connection";
import NotFoundException from "@exceptions/not-found.exception";
import { KAFKA_EVENTS } from "@constants";
import KafkaService from ".";
import Packet from "@datasources/models/packet.model";
import { Op } from "sequelize";

export async function handleOrderCreatedEvent(event: OrderCreatedEvent) {
    const t = await dbConnection.transaction()
    const order = event.payload.order;
    try {
        const packet = await Packet.findOne({
            where: {
                [Op.or]: [
                    { isReserved: true,
                        orderId: order.orderId,
                        food_id: 1, },
                    { isReserved: false,
                        orderId: null,
                        food_id: 1,    }
                ],
            },
            order: [
                ['isReserved', 'DESC']
            ],
            transaction: t,
            lock: t.LOCK.UPDATE
          })
        
        if(!packet) throw new NotFoundException("Food Packets Not Available.");
        if(packet.isReserved && packet.orderId !== null) {
            await t.commit();
            return;
        };
        packet.isReserved = true;
        packet.orderId = order.orderId;
        await packet.save({transaction: t})
        await t.commit()
        KafkaService.produceEvent({
            eventType: KAFKA_EVENTS.FOOD_ASSIGNED,
            key: packet?.id?.toString() ?? '',
            payload: {
                packet,
                order
            }
        })
    } catch (error:any) {
        t.rollback();
        KafkaService.produceEvent({
            eventType: KAFKA_EVENTS.FOOD_ASSIGN_FAILED,
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
        const packet = await Packet.findOne({
            where: {
              isReserved: true,
              orderId: order.orderId
            },
            transaction: t,
            lock: t.LOCK.UPDATE
          })
        
        if(!packet) {
            await t.commit()
            return;
        }

        packet.isReserved = false;
        packet.orderId = null;
        await packet.save({transaction: t})
        await t.commit()
    } catch (error:any) {
        t.rollback();
        console.error('Error handling order failed event:', error);
    }
}