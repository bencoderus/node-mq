import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { PublishOptions } from "amqp-connection-manager/dist/esm/ChannelWrapper";
import { RMQConnect } from "../rabbit-mq.connect";
import { RMQClient } from "../rabbitmq-client";

type PublisherPayload = {
  event: string;
  payload: string;
};

export abstract class RMQEvent {
  protected abstract event: string;
  protected queue: string;
  private _connection: IAmqpConnectionManager;

  /**
   * Publish message to event queue.
   *
   * @param message
   *
   * @param {PublishOptions} options
   */
  public abstract publish(
    message: unknown,
    options?: PublishOptions
  ): Promise<void>;

  /**
   * It takes a payload, publishes it to the channel, and returns the payload.
   *
   * @param any body - The payload to be sent to the queue.
   *
   * @returns The body of the message.
   */
  public async send(body: any) {
    const channel = await this.getChannel();

    await channel.publish(body, {
      headers: {
        event: this.event,
      },
    });

    return body;
  }

  /**
   * Set RabbitMQ connection.
   *
   * @param {IAmqpConnectionManager} connection
   *
   * @returns {RMQEvent}
   */
  public setConnection(connection: IAmqpConnectionManager) {
    this._connection = connection;

    return this;
  }

  /**
   * If the connection is not set, throw an error, otherwise return the connection.
   *
   * @returns The connection is being returned.
   */
  private async getConnection(): Promise<IAmqpConnectionManager> {
    const connection = this._connection || (await this.connection());

    if (!connection) {
      throw new Error("Connection is not set");
    }

    return connection;
  }

  /**
   * It creates a new RMQClient object, sets the exchange and queue if they are defined, and returns the
   * messageBroker object.
   *
   * @returns A new RMQClient object with the connection, exchange, and queue set.
   */
  public async getChannel() {
    const connection = await this.getConnection();
    let messageBroker = new RMQClient(connection);

    messageBroker.setExchange(this.event);

    if (this.queue) {
      messageBroker.setQueue(this.queue);
    }

    return messageBroker;
  }

  /**
   * The child connection would overwrite this method to return a connection object.
   */
  protected connection() {
    return RMQConnect.connection;
  }
}
