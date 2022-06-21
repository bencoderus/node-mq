import { AmqpConnectionManager, ChannelWrapper } from "amqp-connection-manager";
import { ConsumeMessage } from "amqplib";
import { PublishOptions } from "amqp-connection-manager/dist/esm/ChannelWrapper";

export class RabbitMqClient {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private exchange: string;
  private exchanges: string[];
  private exchangeType = "topic";
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

  public setExchanges(exchanges: string[], exchangeType = "topic"): this {
    this.exchanges = exchanges;
    this.exchangeType = exchangeType;

    return this;
  }

  private createPublisherPayload() {
    return this.exchange
      ? this.createPubSubPublisherPayload()
      : this.createSenderPublisherPayload();
  }

  private createPubSubPublisherPayload() {
    return {
      json: true,
      setup: (channel: any) => {
        return channel.assertExchange(this.exchange, this.exchangeType);
      },
    };
  }

  private createSenderPublisherPayload() {
    return {
      json: true,
      setup: (channel: any) => {
        return channel.assertQueue(this.queue, { durable: true });
      },
    };
  }

  private getConsumerPayload() {
    return this.exchanges
      ? this.createPubSubConsumerPayload()
      : this.createReceiverConsumerPayload();
  }

  private createReceiverConsumerPayload() {
    if (!this.queue) {
      throw new Error("Please set your queue first");
    }

    return {
      setup: (channel: any) => {
        return Promise.all([
          channel.assertQueue(this.queue, { durable: true }),
          channel.prefetch(1),
        ]);
      },
    };
  }

  private createPubSubConsumerPayload() {
    if (!(this.queue && this.exchanges && this.exchanges.length > 0)) {
      throw new Error(
        "Please set your queue and exchanges to use the PubSub consumer."
      );
    }

    return {
      json: true,
      setup: (channel) => {
        return Promise.all(
          this.buildExchangeBinding(channel, this.queue, this.exchangeType)
        );
      },
    };
  }

  private buildExchangeBinding(channel, queue: string, exchangeType: string) {
    const bindings = [];

    this.exchanges.forEach(function (exchange) {
      bindings.push(channel.assertQueue(queue));

      bindings.push(channel.assertExchange(exchange, exchangeType));

      bindings.push(channel.prefetch(1));

      bindings.push(channel.bindQueue(queue, exchange, "#"));
    });

    return bindings;
  }

  public publish(message: unknown, options?: PublishOptions) {
    this.channel = this.connection.createChannel(this.createPublisherPayload());

    console.log(this.exchange, message);

    if (this.exchange) {
      return this.publishToExchange(message, options);
    }

    return this.publishToQueue(message, options);
  }

  public publishToQueue(message: unknown, options?: PublishOptions) {
    this.channel = this.connection.createChannel(
      this.createSenderPublisherPayload()
    );

    return this.channel.sendToQueue(this.queue, message, options);
  }

  public publishToExchange(message: unknown, options?: PublishOptions) {
    this.channel = this.connection.createChannel(this.createPublisherPayload());

    return this.channel.publish(this.exchange, "#", message, options);
  }

  public consume(callback: (message: ConsumeMessage) => void) {
    this.channel = this.connection.createChannel(this.getConsumerPayload());

    return this.channel.consume(this.queue, callback);
  }

  public ack(message: ConsumeMessage) {
    this.channel.ack(message);
  }
}
