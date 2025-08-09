import runProducer from "./producer";
import runConsumer from "./consumer";

const run = async () => {
  // produce the message with float value
  await runProducer();
  // consumer the message and print the decoded float value
  await runConsumer();
};

run();
