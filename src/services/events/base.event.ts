import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { PublishOptions } from "amqp-connection-manager/dist/esm/ChannelWrapper";
import { RabbitMqClient } from "../rabbitmq-client";

export abstract class BaseEvent {
  protected abstract event: string;
  protected abstract queue: string;
  protected exchange: string;
  private _connection: IAmqpConnectionManager;

  public abstract publish(
    message: unknown,
    options?: PublishOptions
  ): Promise<void>;

  public setConnection(connection: IAmqpConnectionManager) {
    this._connection = connection;

    return this;
  }

  private getConnection(): IAmqpConnectionManager {
    const connection = this._connection || this["connection"]();

    if (!connection) {
      throw new Error("Connection is not set");
    }

    return connection;
  }

  public getChannel() {
    const connection = this.getConnection();
    let messageBroker = new RabbitMqClient(connection);

    if (this.exchange) {
      messageBroker.setExchange(this.exchange);
    }

    return messageBroker.setQueue(this.queue);
  }

  protected buildPayload(message: any): Record<string, unknown> {
    return {
      event: this.event,
      payload: message,
    };
  }
}
