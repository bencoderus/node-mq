import { RMQMessage, RMQListener } from "@liquidator/common";

export class TradeConsumer extends RMQListener {
  public queue = "trade-queue";
  public exchanges = ["client_created"];

  public async listen(): Promise<void> {
    this.consume((message: RMQMessage) => {
      console.log(message.event(), message.payload());
      message.ack();
    });
  }
}
