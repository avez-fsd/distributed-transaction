import { KAFKA_EVENTS } from "@constants";
import Order from "@datasources/models/order.model";


export interface Agent {
    id: number;
    name: string;
    isReserved: boolean;
    orderId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AgentAssignedEvent {
    eventType: KAFKA_EVENTS.AGENT_ASSIGNED;
    payload: {
        agent: Agent;
        order: Order
    };
    key: string;
}

export interface AgentAssignFailedEvent {
    eventType: KAFKA_EVENTS.AGENT_ASSIGN_FAILED;
    payload: {
        order: Order
        failureReason: string
    };
    key: string;
}