export const TEXT = {
    OK: 'OK'
}

export enum KAFKA_EVENTS {
    ORDER_CREATED = 'ORDER_CREATED',
    ORDER_CONFIRMED = 'ORDER_CONFIRMED',
    ORDER_FAILED = 'ORDER_FAILED',
    ORDER_CANCELLED = 'ORDER_CANCELLED',
    AGENT_ASSIGNED = 'AGENT_ASSIGNED',
    AGENT_ASSIGN_FAILED = 'AGENT_ASSIGN_FAILED',
    FOOD_ASSIGNED = 'FOOD_ASSIGNED',
    FOOD_ASSIGN_FAILED = 'FOOD_ASSIGN_FAILED',
}

export enum KAFKA_TOPICS {
    ORDERS = 'orders',
    DELIVERY = 'delivery',
    STORE = 'store',
}