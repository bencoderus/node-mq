import { RMQEvent } from "./base.event";

type EventPayload = {
  id: number | string;
  name: string;
};

export class UserUpdated extends RMQEvent {
  public event = "user:updated";
  public exchange = "user_updated";

  public async publish(message: EventPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }
}
