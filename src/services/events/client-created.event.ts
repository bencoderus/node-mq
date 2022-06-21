import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { RabbitMqConnection } from "../rabbit-mq-connection";
import { BaseEvent } from "./base.event";

type ClientPayload = {
  id: number | string;
  name: string;
};

export class ClientCreated extends BaseEvent {
  public event = "client-created";
  public exchange = "lagos";

  public async publish(message: ClientPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }

  protected connection(): IAmqpConnectionManager {
    return RabbitMqConnection.getConnection();
  }
}
