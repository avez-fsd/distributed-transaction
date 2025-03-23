import { KAFKA_EVENTS } from "@constants";
import Order from "@datasources/models/order.model";

export interface Packet {
    id: number;
    isReserved: boolean;
    orderId: string;
    food_id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PacketAssignedEvent {
    eventType: KAFKA_EVENTS.FOOD_ASSIGNED;
    payload: {
        packet: Packet;
        order: Order
    };
    key: string;
}

export interface PacketAssignFailedEvent {
    eventType: KAFKA_EVENTS.FOOD_ASSIGN_FAILED;
    payload: {
        order: Order
    };
    key: string;
}