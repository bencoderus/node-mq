import { RMQEvent } from "./base.event";

type EventPayload = {
  id: number | string;
  name: string;
};

export class UserCreated extends RMQEvent {
  public event = "user:created";
  public exchange = "user_created";

  public async publish(message: EventPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }
}
