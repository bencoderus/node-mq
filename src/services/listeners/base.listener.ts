import { ChannelWrapper } from "amqp-connection-manager";
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { ConsumeMessage } from "amqplib";
import { RabbitMqClient } from "../rabbitmq-client";

type MessageBody = {
  event: string;
  payload: unknown;
};

export abstract class BaseListener {
  public abstract queue: string;
  protected exchange: string;
  private _connection: IAmqpConnectionManager;

  public abstract listen(callback: (message: ConsumeMessage) => void): void;

  protected getMessageBody(message: ConsumeMessage): MessageBody {
    return JSON.parse(message.content.toString());
  }

  protected getEventName(message: MessageBody): string {
    return message.event || "";
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

  protected getChannel(): RabbitMqClient {
    const connection = this.getConnection();
    let messageBroker = new RabbitMqClient(connection);

    console.log("queue is: ", this.queue);

    return messageBroker.setQueue(this.queue);
  }
}
