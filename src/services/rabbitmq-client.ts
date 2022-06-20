import { AmqpConnectionManager, ChannelWrapper } from "amqp-connection-manager";
import { ConsumeMessage } from "amqplib";
import { PublishOptions } from "amqp-connection-manager/dist/esm/ChannelWrapper";

export class RabbitMqClient {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private exchange: string;
  private exchangeType: string;
  private queue: string;

  constructor(connection: AmqpConnectionManager) {
    this.connection = connection;
  }

  public setQueue(queueName: string): this {
    this.queue = queueName;

    return this;
  }

  public setExchange(exchangeName: string, exchangeType = "topic"): this {
    this.exchange = exchangeName;
    this.exchangeType = exchangeType;

    return this;
  }

  private createDefaultChannelPayload() {
    return {
      json: true,
      setup: (channel: any) => {
        return channel.assertQueue(this.queue, { durable: true });
      },
    };
  }

  private getChannelPayload() {
    return this.exchange
      ? this.createExchangeChannelPayload()
      : this.createDefaultChannelPayload();
  }

  private createExchangeChannelPayload() {
    return {
      json: true,
      setup: (channel) => {
        return Promise.all([
          channel.assertQueue(this.queue, {
            exclusive: true,
            autoDelete: true,
          }),
          channel.assertExchange(this.exchange, this.exchangeType),
          channel.prefetch(1),
          channel.bindQueue(this.queue, this.exchange, "#"),
        ]);
      },
    };
  }

  public publish(message: unknown, options?: PublishOptions) {
    this.channel = this.connection.createChannel(this.getChannelPayload());
    const medium = this.exchange ? this.exchange : this.queue;

    return this.channel.sendToQueue(medium, message, options);
  }

  public consume(callback: (message: ConsumeMessage) => void) {
    this.channel = this.connection.createChannel(this.getChannelPayload());

    return this.channel.consume(this.queue, callback);
  }

  public ack(message: ConsumeMessage) {
    this.channel.ack(message);
  }
}
