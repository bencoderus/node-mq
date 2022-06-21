import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { ConsumeMessage } from "amqplib";
import { RMQConnection } from "../rabbitmq-connection";
import { RMQMessage } from "../rabbitmq-message";
import { BaseListener } from "./base.listener";

export class EmailQueueListener extends BaseListener {
  public queue = "email-queue";

  public listen() {
    const channel = this.getChannel();

    channel.consume((consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);

      console.log(messageReceived.event(), messageReceived.payload());

      channel.ack(consumeMessage);
    });
  }

  protected connection(): IAmqpConnectionManager {
    return RMQConnection.getConnection();
  }
}
