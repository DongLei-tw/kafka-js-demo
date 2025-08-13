import {
  DecodeOptions,
  SchemaRegistry,
} from "@kafkajs/confluent-schema-registry";
import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import DecimalType from "./decimal-java";

// Read a message from local Kafka topic, the event was published by local AP data-generator which contains decimal values
const brokerServer = "localhost:9092";
const schemaRegistryHost = "http://localhost:8081";
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
    console.log(
      "bigdecimal value",
      decodedValue.roofEaveHeight
      ?.attributeValue
      ?.["com.reagroup.property.conformed.FloatAttributeValue"]
      ?.value
    );
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

  const schemaRegistry = new SchemaRegistry(
    { host: schemaRegistryHost },
    // IMPORTANT: register logical types for decimal
    {
      forSchemaOptions: {
        logicalTypes: { "decimal": DecimalType },
      },
    }
  );
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
