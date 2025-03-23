
import { Consumer, Kafka, Producer } from "kafkajs";
import { KAFKA_EVENTS, KAFKA_TOPICS } from "@constants";
import { handleOrderCreatedEvent, handleOrderFailed } from "./orders.processor";

interface KafkaEvent {
    eventType: KAFKA_EVENTS;
    key: string;
    payload: any;
}

class KafkaService {
    private static client: Kafka;
    private static producer: Producer | undefined;
    private static consumer: Consumer | undefined;
    private static isInitialized: boolean = false;

    private static initializeClient() {
        if (!KafkaService.client) {
            KafkaService.client = new Kafka({
                clientId: "kafka-admin",
                brokers: ["localhost:9092"],
            });
        }
    }

    static async init() {
        if (KafkaService.isInitialized) {
            console.log('Kafka service already initialized');
            return;
        }

        try {
            // Initialize client if not already done
            KafkaService.initializeClient();

            // Initialize producer
            KafkaService.producer = KafkaService.client.producer();
            await KafkaService.producer.connect();
            
            // Initialize consumer
            KafkaService.consumer = KafkaService.client.consumer({ 
                groupId: "delivery-service" 
            });
            await KafkaService.consumer.connect();
            
            // Subscribe to relevant topics
            await KafkaService.consumer.subscribe({ 
                topics: ['orders'],
                fromBeginning: true
            });

            KafkaService.startConsuming()

            KafkaService.isInitialized = true;
            console.log('Kafka service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Kafka:', error);
            throw error;
        }
    }

    static async disconnect() {
        try {
            if (KafkaService.producer) {
                await KafkaService.producer.disconnect();
            }
            if (KafkaService.consumer) {
                await KafkaService.consumer.disconnect();
            }
        } catch (error) {
            console.error('Failed to disconnect from Kafka:', error);
            throw error;
        }
    }

    // Produce order events
    static async produceEvent(event: KafkaEvent) {
        if (!KafkaService.producer) {
            throw new Error('Kafka producer not initialized');
        }

        try {
            await KafkaService.producer.send({
                topic: KAFKA_TOPICS.DELIVERY,
                messages: [
                    {
                        key: event.key,
                        value: JSON.stringify(event),
                        headers: {
                            eventType: event.eventType
                        }
                    }
                ]
            });
            console.log(`Order event produced successfully: ${event.eventType}`);
        } catch (error) {
            console.error('Failed to produce order event:', error);
            throw error;
        }
    }

    // Start consuming messages
    static async startConsuming() {
        if (!KafkaService.consumer) {
            throw new Error('Kafka consumer not initialized');
        }

        try {
            await KafkaService.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        const value = message.value?.toString();
                        if (!value) return;

                        const event = JSON.parse(value);
                        console.log('Received event:', event);
                        switch (topic) {
                            case 'orders':
                                await this.handleOrderEvent(event);
                                break;
                            case 'store':
                                await this.handleStoreEvent(event);
                                break;
                        }
                    } catch (error) {
                        console.error(`Error processing message from topic ${topic}:`, error);
                    }
                }
            });
        } catch (error) {
            console.error('Failed to start consuming:', error);
            throw error;
        }
    }

    // Handle different types of events
    private static async handleOrderEvent(event: any) {
        console.log('Processing order event:', event);
        switch (event.eventType) {
            case KAFKA_EVENTS.ORDER_CREATED:
                await handleOrderCreatedEvent(event);
                break;
            case KAFKA_EVENTS.ORDER_FAILED:
                await handleOrderFailed(event);
                break;
            default:
                console.log('Unknown event type:', event.eventType);
                break;
        }
        // Implement your order processing logic here
        // For example: update order status in database
    }

    private static async handleDeliveryEvent(event: any) {
        console.log('Processing delivery event:', event);
        // Implement your delivery processing logic here
        // For example: update delivery status
    }

    private static async handleStoreEvent(event: any) {
        console.log('Processing store event:', event);
        // Implement your store processing logic here
        // For example: update inventory
    }
}

export default KafkaService;