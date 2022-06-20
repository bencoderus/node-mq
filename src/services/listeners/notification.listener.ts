import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { channels } from "src/constants/channels.constant";
import { RabbitMqConnection } from "../rabbit-mq-connection";
import { BaseListener } from "./base.listener";

export class NotificationQueueListener extends BaseListener {
  public queue = "notification-queue";

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
