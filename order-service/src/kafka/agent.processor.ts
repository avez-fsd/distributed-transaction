import { KAFKA_EVENTS } from "@constants";
import dbConnection from "@datasources/connection";
import Order, { OrderStatus } from "@datasources/models/order.model";
import { AgentAssignedEvent, AgentAssignFailedEvent } from "src/interfaces/agent.interface";
import KafkaService from ".";

export async function handleAgentAssignedEvent(event: AgentAssignedEvent) {
    const t = await dbConnection.transaction()
    try {
        const { agent } = event.payload;
        const order = await Order.findOne({
            where: {
                orderId: agent.orderId
            },
            transaction: t,
            lock: t.LOCK.UPDATE
        })
        if(!order) return;
        order.agentId = agent.id;
        if(order.packetId !== null) {
            order.status = OrderStatus.SUCCESS;
        }
        await order.save({transaction: t})
        await t.commit()
    } catch (error) {
        console.error(`Error in handleAgentAssignedEvent`, error);
        t.rollback();
    }
}

export async function handleAgentAssignFailedEvent(event: AgentAssignFailedEvent) {
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
        if(orderDb.status === OrderStatus.FAILED) {
            await t.commit();
            return;
        };
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
        console.error(`Error in handleAgentAssignFailedEvent`, error);
        t.rollback();
    }
}