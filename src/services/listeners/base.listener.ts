import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { ConsumeMessage } from "amqplib";
import { RMQClient } from "../rabbitmq-client";

export abstract class BaseListener {
  public abstract queue: string;
  protected exchanges: string[];
  private _connection: IAmqpConnectionManager;

  public abstract listen(callback: (message: ConsumeMessage) => void): void;

  public setConnection(connection: IAmqpConnectionManager) {
    this._connection = connection;

    return this;
  }

  protected getChannel(): RMQClient {
    const connection = this.getConnection();
    let messageBroker = new RMQClient(connection);

    if (Array.isArray(this.exchanges) && this.exchanges.length > 0) {
      messageBroker.setExchanges(this.exchanges);
    }

    return messageBroker.setQueue(this.queue);
  }

  private getConnection(): IAmqpConnectionManager {
    const connection = this._connection || this["connection"]();

    if (!connection) {
      throw new Error("Connection is not set");
    }

    return connection;
  }
}
