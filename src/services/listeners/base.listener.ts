import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { ConsumeMessage } from "amqplib";
import { RMQConnect } from "../rabbit-mq.connect";
import { RMQClient } from "../rabbitmq-client";

export abstract class RMQListener {
  public abstract queue: string;
  protected events: string[];
  private _connection: IAmqpConnectionManager;

  /**
   * Consume messages from queue.
   *
   * @param callback
   */
  public abstract consume(callback: (message: ConsumeMessage) => void): void;

  /**
   * Set connection object.
   *
   * @param {IAmqpConnectionManager} connection - The connection manager instance.
   *
   * @returns The instance of the class.
   */
  public setConnection(connection: IAmqpConnectionManager) {
    this._connection = connection;

    return this;
  }

  /**
   * It creates a new RMQClient instance, sets the exchanges and queues, and returns the RMQClient
   *
   * @returns A new RMQClient instance with the connection and queue set.
   */
  protected async getChannel(): Promise<RMQClient> {
    const connection = await this.getConnection();
    let messageBroker = new RMQClient(connection);

    if (Array.isArray(this.events) && this.events.length > 0) {
      messageBroker.setExchanges(this.events);
    }

    return messageBroker.setQueue(this.queue);
  }

  /**
   * Get connection object.
   *
   * @returns The connection object
   */
  private async getConnection(): Promise<IAmqpConnectionManager> {
    const connection = this._connection || (await this.connection());

    if (!connection) {
      throw new Error("Connection is not set");
    }

    return connection;
  }

  /**
   * The child connection would overwrite this method to return a connection object.
   */
  protected connection() {
    return RMQConnect.connection;
  }
}
