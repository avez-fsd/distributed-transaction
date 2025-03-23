import dbConnection from "@datasources/connection";
import Order, { OrderStatus } from "@datasources/models/order.model";
import { PacketAssignedEvent, PacketAssignFailedEvent } from "src/interfaces/store.interface";
import KafkaService from ".";
import { KAFKA_EVENTS } from "@constants";


export async function handleFoodAssignedEvent(event: PacketAssignedEvent) {
    const t = await dbConnection.transaction()
    try {
        const { packet } = event.payload;
        const order = await Order.findOne({
            where: {
                orderId: packet.orderId
            },
            transaction: t,
            lock: t.LOCK.UPDATE
        })
        if(!order) return;
        order.packetId = packet.id;
        if(order.agentId !== null) {
            order.status = OrderStatus.SUCCESS;
        }
        await order.save({transaction: t})
        await t.commit()
    } catch (error) {
        console.error(`Error in handleFoodAssignedEvent`, error);
        t.rollback();
    }
}

export async function handleFoodAssignFailedEvent(event: PacketAssignFailedEvent) {
    const t = await dbConnection.transaction()
    try {
        const { order } = event.payload;
        const orderDb = await Order.findOne({
            where: {
                orderId: order.orderId
            },
            transaction: t,
            lock: t.LOCK.UPDATE
        })
        if(!orderDb) return;
        orderDb.status = OrderStatus.FAILED;
        await orderDb.save({transaction: t})
        await t.commit()
        KafkaService.produceEvent({
            eventType: KAFKA_EVENTS.ORDER_FAILED,
            key: order.orderId as string,
            payload: {
                order: event.payload.order,
            }
        })
    } catch (error) {
        console.error(`Error in handleFoodAssignFailedEvent`, error);
        t.rollback();
    }
}