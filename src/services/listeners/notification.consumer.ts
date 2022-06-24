import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { ConsumeMessage } from "amqplib";
import { RMQMessage } from "../rabbitmq-message";
import { RMQConsumer } from "./base.consumer";

export class NotificationConsumer extends RMQConsumer {
  public queue = "notification-queue";
  public exchanges = ["client_created"];

  public async consume() {
    const channel = await this.getChannel();

    channel.consume((consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);

      console.log(messageReceived.event(), messageReceived.payload());

      channel.ack(consumeMessage);
    });
  }
}
