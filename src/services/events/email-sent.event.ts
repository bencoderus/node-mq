import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { RMQConnection } from "../rabbitmq-connection";
import { BaseEvent } from "./base.event";

type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

export class EmailSent extends BaseEvent {
  public event = "email-sent";
  public queue = "email-queue";

  public async publish(message: EmailPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }

  protected connection(): IAmqpConnectionManager {
    return RMQConnection.getConnection();
  }
}
