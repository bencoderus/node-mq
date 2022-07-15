import { RMQMessage, RMQListener } from "@liquidator/common";

export class NotificationConsumer extends RMQListener {
  public queue = "notification-queue";
  public exchanges = ["client_created"];

  public async listen(): Promise<void> {
    this.consume((message: RMQMessage) => {
      console.log(message.event(), message.payload());
      message.ack();
    });
  }
}
