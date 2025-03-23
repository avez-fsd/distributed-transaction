import { KAFKA_EVENTS } from "@constants";

export interface OrderCreatedEvent {
    eventType: KAFKA_EVENTS.ORDER_CREATED;
    payload: {
        order: Order
    };
    key: string;
}

export interface OrderFailedEvent {
    eventType: KAFKA_EVENTS.ORDER_FAILED;
    payload: {
        order: Order
    };
    key: string;
}

export interface Order {
    id: string;
    orderId: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum OrderStatus {
    INITIAL= 'INITIAL',
    PENDING= 'PENDING',
    SUCCESS= 'SUCCESS',
    FAILED= 'FAILED'
}