import { RMQEvent } from "./base.event";

type EventPayload = {
  id: number | string;
  name: string;
};

export class UserUpdated extends RMQEvent {
  public event = "user_updated";
  
  public async publish(message: EventPayload): Promise<void> {
    return this.send(message)
  }
}
