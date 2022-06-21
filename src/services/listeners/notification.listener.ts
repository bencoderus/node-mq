import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { ConsumeMessage } from "amqplib";
import { RabbitMqConnection } from "../rabbit-mq-connection";
import { RMQMessage } from "../rabbitmq-message";
import { BaseListener } from "./base.listener";

export class NotificationQueueListener extends BaseListener {
  public queue = "notification-queue";
  public exchanges = ["lagos"];

  public listen() {
    const channel = this.getChannel();

    channel.consume((consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);

      console.log(messageReceived.event(), messageReceived.payload());

      channel.ack(consumeMessage);
    });
  }

  protected connection(): IAmqpConnectionManager {
    return RabbitMqConnection.getConnection();
  }
}
