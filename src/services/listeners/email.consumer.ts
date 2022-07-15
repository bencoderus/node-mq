import { RMQMessage, RMQListener } from "@liquidator/common";

export class EmailConsumer extends RMQListener {
  public queue = "email-queue";

  public async listen(): Promise<void> {
    this.consume((message: RMQMessage) => {
      console.log(message.event(), message.payload());
      message.ack();
    });
  }
}
