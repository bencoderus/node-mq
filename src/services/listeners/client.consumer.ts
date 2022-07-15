import { RMQMessage, RMQListener } from "@liquidator/common";

export class ClientConsumer extends RMQListener {
  public queue = "client-queue";
  public exchanges = ["lagos"];

  public async listen(): Promise<void> {
    this.consume((message: RMQMessage) => {
      console.log(message.event(), message.payload());
      message.ack();
    });
  }
}
