import {
  readAVSCAsync,
  SchemaRegistry,
} from "@kafkajs/confluent-schema-registry";
import { Kafka } from "kafkajs";
import * as path from "path";

const brokerServer = "localhost:39092";
const schemaRegistryHost = "http://localhost:8081";
const topicName = "events.property.conformed.attributes.v1";

const run = async (role: string) => {
  console.log(`Running as ${role} ...`);

  const schemaRegistry = new SchemaRegistry({ host: schemaRegistryHost });

  const filePath = path.join(__dirname, "schema/attributes.avsc");
  const avroSchema = await readAVSCAsync(filePath);

  const registeredSchema = await schemaRegistry.register(avroSchema, {
    subject: `${topicName}-value`,
  });

  const encodeAvro = schemaRegistry.encode.bind(schemaRegistry);

  const kafka = new Kafka({
    brokers: [brokerServer],
    ssl: false,
    clientId: "kafka-js-demo",
  });

  const attributeMessage = {
    propertyId: 1,
    bedrooms: 2,
    livingArea: 123.45,
    buildingArea: 123.45,
  };

  const encodedMessage = await encodeAvro(
    registeredSchema.id,
    attributeMessage
  );

  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: topicName,
    messages: [{ key: "1", value: encodedMessage }],
  });

  console.log("message send to kafak!");

  producer.disconnect();
};

run("producer");


export default function runProducer() {
  return run("producer");
}