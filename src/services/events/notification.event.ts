import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { RabbitMqConnection } from "../rabbit-mq-connection";
import { BaseEvent } from "./base.event";

type NotificationPayload = {
  message: string;
};

export class NotificationSent extends BaseEvent {
  public event = "notification-sent";
  public queue = "notification-queue";

  public async publish(message: NotificationPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }

  protected connection(): IAmqpConnectionManager {
    return RabbitMqConnection.getConnection();
  }
}
