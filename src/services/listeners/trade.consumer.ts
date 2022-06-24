import { ConsumeMessage } from "amqplib";
import { RMQMessage } from "../rabbitmq-message";
import { RMQConsumer } from "./base.consumer";

export class TradeConsumer extends RMQConsumer {
  public queue = "trade-queue";
  public exchanges = ["lagos", "rio"];

  public async consume() {
    const channel = await this.getChannel();

    channel.consume((consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);

      console.log(messageReceived.event(), messageReceived.payload());

      channel.ack(consumeMessage);
    });
  }
}
