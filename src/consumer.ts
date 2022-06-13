import { ConsumeMessage } from "amqplib";
import { channels } from "./constants/channels.constant";
import { MessageQueue } from "./services/rabbit-queue";

for (let key in channels) {
  const channelName = channels[key];
  const queue = MessageQueue.getQueue(channelName);

  queue.consume(async (message: ConsumeMessage) => {
    console.log(`Received message on ${channelName}.`);
    console.log(message.content.toString());
    queue.ack(message);
  });
}
