import { RMQEvent } from "@liquidator/common";

type NotificationPayload = {
  message: string;
};

export class NotificationSent extends RMQEvent {
  public event = "notification-sent";
  public queue = "notification-queue";

  public async publish(message: NotificationPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }
}
