import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { ConsumeMessage } from "amqplib";
import { RMQConnect } from "../rabbit-mq.connect";
import { RMQMessage } from "../rabbitmq-message";
import { RMQConsumer } from "./base.consumer";

export class EmailConsumer extends RMQConsumer {
  public queue = "email-queue";

  public async consume() {
    const channel = await this.getChannel();

    channel.consume((consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);

      console.log(messageReceived.event(), messageReceived.payload());

      channel.ack(consumeMessage);
    });
  }
}
