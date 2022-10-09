import { RMQEvent } from "./base.event";

type EventPayload = {
  id: number | string;
  name: string;
};

export class UserCreated extends RMQEvent {
  public event = "user_created";

  public async publish(message: EventPayload): Promise<void> {
    return this.send(message);
  }
}
