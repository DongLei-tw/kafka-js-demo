import {
  DecodeOptions,
  SchemaRegistry,
} from "@kafkajs/confluent-schema-registry";
import { Consumer, EachMessagePayload, Kafka } from "kafkajs";

const brokerServer = "localhost:39092";
const schemaRegistryHost = "http://schema-registry:8081";
const topicName = "events.property.conformed.attributes.v1";

const runMyConsumer = async (
  consumer: Consumer,
  topicName: string,
  decodeAvroFunc: (buffer: Buffer, options?: DecodeOptions) => Promise<any>
): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: topicName, fromBeginning: true });

  console.log(`Consumer subscribed to topic: ${topicName}`);

  const handleMessage = async ({
    partition,
    message,
  }: EachMessagePayload): Promise<void> => {
    console.log(`partition: ${partition}, offset: ${message.offset}`);

    const decodedValue = await decodeAvroFunc(message.value!);

    console.log("float value", decodedValue.livingArea);
    // await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
  };

  await consumer.run({
    eachBatchAutoResolve: false,
    autoCommit: false,
    partitionsConsumedConcurrently: 1,
    eachMessage: handleMessage,
  });
};

const run = async (role: string) => {
  console.log(`Running as ${role} ...`);

  const schemaRegistry = new SchemaRegistry({ host: schemaRegistryHost });
  const decodeAvro = schemaRegistry.decode.bind(schemaRegistry);

  const kafka = new Kafka({
    brokers: [brokerServer],
    ssl: false,
    clientId: "kafka-js-demo",
  });

  const consumer = kafka.consumer({ groupId: "consumer-1" });
  await consumer.connect();
  await consumer.subscribe({ topic: topicName, fromBeginning: true });

  await runMyConsumer(consumer, topicName, decodeAvro);
};

run("consumer");

export default function runConsumer() {
  return run("consumer");
}