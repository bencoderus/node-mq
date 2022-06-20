import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { RabbitMqConnection } from "../rabbit-mq-connection";
import { BaseEvent } from "./base.event";

type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

export class EmailSent extends BaseEvent {
  public event = "client-created";
  public queue = "client-queue";

  public async publish(message: EmailPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.getChannel().publish(payload);
  }

  protected connection(): IAmqpConnectionManager {
    return RabbitMqConnection.getConnection();
  }
}
