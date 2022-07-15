import { RMQEvent } from "@liquidator/common";

type ClientPayload = {
  id: number | string;
  name: string;
};

export class ClientCreated extends RMQEvent {
  public event = "client-created";
  public exchange = "lagos";

  public async publish(message: ClientPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }
}
