import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { channels } from "../constants/channels.constant";
import { RabbitMqConnection } from "./rabbit-mq-connection";
import { RabbitMq } from "./rabbitmq.service";

export class MessageQueue {
  public static getQueues(): Record<string, RabbitMq> {
    const queues: Record<string, RabbitMq> = {};

    for (let key in channels) {
      const channelName = channels[key];

      queues[channelName] = new RabbitMq(
        RabbitMqConnection.getConnection(),
        channelName
      );
    }

    return queues;
  }

  public static getQueue(channelName: string) {
    if (!Object.values(channels).includes(channelName)) {
      throw new Error(`Channel ${channelName} does not exist.`);
    }

    const queues = MessageQueue.getQueues();

    return queues[channelName];
  }
}
