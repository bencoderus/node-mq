import { ConsumeMessage } from "amqplib";
import { ChannelWrapper } from "amqp-connection-manager";

export class RMQMessage {
  private readonly _messageBody: any;

  constructor(private message: ConsumeMessage) {
    this._messageBody = this.parseMessage();
  }

  public ack(channel: ChannelWrapper): void {
    channel.ack(this.message);
  }

  public event(): string {
    return typeof this._messageBody === "string" ? "" : this._messageBody.event;
  }

  public payload(): any {
    return typeof this._messageBody === "string"
      ? this._messageBody
      : this._messageBody.payload;
  }

  public rawBody() {
    return this.message.content.toString();
  }

  public body() {
    return this._messageBody;
  }

  private parseMessage() {
    const body = this.message.content.toString();

    try {
      return JSON.parse(body);
    } catch (error) {
      return body;
    }
  }
}
