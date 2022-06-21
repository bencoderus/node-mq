import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { PublishOptions } from "amqp-connection-manager/dist/esm/ChannelWrapper";
import { RabbitMqClient } from "../rabbitmq-client";

type PublisherPayload = {
  event: string;
  payload: string;
}

export abstract class BaseEvent {
  protected abstract event: string;
  protected queue: string;
  protected exchange: string;
  private _connection: IAmqpConnectionManager;

  public abstract publish(
    message: unknown,
    options?: PublishOptions
  ): Promise<void>;

  public async emit(body: PublisherPayload){
    await this.getChannel().publish(body);

    return body;
  }

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

    if (this.queue) {
      messageBroker.setQueue(this.queue);
    }

    return messageBroker;
  }

  protected buildPayload(message: any): PublisherPayload {
    return {
      event: this.event,
      payload: message,
    };
  }
}
