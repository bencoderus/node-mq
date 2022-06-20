import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { RabbitMqConnection } from "../rabbit-mq-connection";
import { BaseListener } from "./base.listener";

export class EmailQueueListener extends BaseListener {
  public queue = "email-queue";

  public listen() {
    const channel = this.getChannel();

    channel.consume((message) => {
      const { event, payload } = this.getMessageBody(message);

      console.log(event, payload);

      channel.ack(message);
    });
  }

  protected connection(): IAmqpConnectionManager {
    return RabbitMqConnection.getConnection();
  }
}