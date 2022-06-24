import { RMQEvent } from "./base.event";

type ClientPayload = {
  id: number | string;
  name: string;
};

export class TradeExecuted extends RMQEvent {
  public event = "trade-executed";
  public exchange = "rio";

  public async publish(message: ClientPayload): Promise<void> {
    const payload = this.buildPayload(message);

    await this.emit(payload);
  }
}
