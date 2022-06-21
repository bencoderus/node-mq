import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { RMQConnection } from "../rabbitmq-connection";
import { BaseEvent } from "./base.event";

type ClientPayload = {
  id: number | string;
  name: string;
};

export class TradeExecuted extends BaseEvent {
  public event = "trade-executed";
  public exchange = "rio";

  public async publish(message: ClientPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }

  protected connection(): IAmqpConnectionManager {
    return RMQConnection.getConnection();
  }
}
