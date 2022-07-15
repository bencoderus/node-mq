import { RMQEvent } from "@liquidator/common";

type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

export class EmailSent extends RMQEvent {
  public event = "email-sent";
  public queue = "email-queue";

  public async publish(message: EmailPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }
}
