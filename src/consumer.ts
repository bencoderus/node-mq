import { ConsumeMessage } from "amqplib";
import { channels } from "./constants/channels.constant";
import { MessageQueue } from "./services/rabbit-queue";

const queue = MessageQueue.getQueue(channels.NOTIFICATION_QUEUE);

queue.consume((message: ConsumeMessage) => {
  console.log(message.content.toString());
  queue.ack(message);
  console.log("Message processed successfully.");
});
