import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { ConsumeMessage } from "amqplib";
import { RMQConnection } from "../rabbitmq-connection";
import { RMQMessage } from "../rabbitmq-message";
import { BaseListener } from "./base.listener";

export class TradeQueueListener extends BaseListener {
  public queue = "trade-queue";
  public exchanges = ["lagos", "rio"];

  public listen() {
    const channel = this.getChannel();

    channel.consume((consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);

      console.log(messageReceived.event(), messageReceived.payload());

      channel.ack(consumeMessage);
    });
  }

  protected connection(): IAmqpConnectionManager {
    return RMQConnection.getConnection();
  }
}
