import { ConsumeMessage } from "amqplib";
import { ChannelWrapper } from "amqp-connection-manager";

export class RMQMessage {
  private readonly _messageBody: any;

  constructor(private message: ConsumeMessage) {
    this._messageBody = this.parseMessage();
  }

  /**
   * Acknowledge the message on the channel.
   *
   * @param {ChannelWrapper} channel - The channel that the message was received on.
   */
  public ack(channel: ChannelWrapper): void {
    channel.ack(this.message);
  }

  /**
   * If the message body is a string, return an empty string, otherwise return the event property of the
   * message body
   *
   * @returns The event property of the message body.
   */
  public event(): string {
    const headers = this.headers();

    return headers.hasOwnProperty('event') ? headers.event : null;
  }

  /**
   * If the message body is a string, return it. Otherwise, return the payload property of the message
   * body.
   *
   * @returns The payload of the message.
   */
  public payload(): any {
    return this._messageBody;
  }
  /**
   * It returns the raw body of the message.
   *
   * @returns {string} The raw body of the message.
   */
  public rawBody(): string {
    return this.message.content.toString();
  }

  /**
   * The function returns the message body.
   *
   * @returns {string} The body of the message.
   */
  public body(): any {
    return this._messageBody;
  }

  /**
   * It returns the headers of the message.
   *
   * @returns {Record<string, any>} The headers of the message.
   */
  public headers(): Record<string, any> {
    return this.message.properties.headers;
  }

  /**
   * It returns the message's properties.
   *
   * @returns The properties of the message.
   */
  public properties(): Record<string, any> {
    return this.message.properties;
  }

  /**
   * It tries to parse the message content as JSON, and if it fails, it returns the message content as a
   * string.
   *
   * @returns The message content is being returned.
   */
  private parseMessage() {
    const body = this.message.content.toString();

    try {
      return JSON.parse(body);
    } catch (error) {
      return body;
    }
  }
}
