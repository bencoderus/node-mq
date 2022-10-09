import { ConsumeMessage } from "amqplib";
import { RMQMessage } from "../rabbitmq-message";
import { RMQListener } from "./base.listener";

export class PostListener extends RMQListener {
  public queue = "post_queue";
  public events = ["user_created", "user_updated"];

  public async consume() {
    const channel = await this.getChannel();

    channel.consume((consumeMessage: ConsumeMessage) => {
      const messageReceived = new RMQMessage(consumeMessage);

      console.log(messageReceived.event(), messageReceived.payload());

      channel.ack(consumeMessage);
    });
  }
}
