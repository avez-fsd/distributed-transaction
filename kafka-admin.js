import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-admin",
  brokers: ["localhost:9092"],
});


async function createTopics() {
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
        topics: [
            {
                topic: "orders",
                numPartitions: 2
            },
            {
                topic: "delivery",
                numPartitions: 2
            },
            {
                topic: "store",
                numPartitions: 2
            }
        ]
    })
    await admin.disconnect();
}

createTopics().then(()=> {
    console.log('Topics created successfully!')
})