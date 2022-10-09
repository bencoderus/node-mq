import { AmqpConnectionManager, ChannelWrapper } from "amqp-connection-manager";
import { Channel, ConsumeMessage } from "amqplib";
import { PublishOptions } from "amqp-connection-manager/dist/esm/ChannelWrapper";

const DEFAULT_PUBLISH_OPTIONS: PublishOptions = {
  persistent: true,
};

export class RMQClient {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private exchange: string;
  private exchanges: string[];
  private exchangeType = "fanout";
  private queue: string;

  constructor(connection: AmqpConnectionManager) {
    this.connection = connection;
  }

  /**
   * "This function sets the queue name and returns the current object."
   *
   * @param {string} queueName - The name of the queue to be created.
   *
   * @returns The instance of the class.
   */
  public setQueue(queueName: string): this {
    this.queue = queueName;

    return this;
  }

  /**
   * "Set the exchange name and type for the queue."
   *
   * The first parameter is the name of the exchange. The second parameter is the type of exchange. The
   * default value for the second parameter is "fanout"
   *
   * @param {string} exchangeName - The name of the exchange to bind to.
   * @param [exchangeType=fanout] - The type of exchange. The default is fanout.
   *
   * @returns The instance of the class.
   */
  public setExchange(exchangeName: string, exchangeType = "fanout"): this {
    this.exchange = exchangeName;
    this.exchangeType = exchangeType;

    return this;
  }

  /**
   * "Set the exchanges to which the message will be published."
   *
   * The first parameter is an array of strings, which are the names of the exchanges to which the
   * message will be published. The second parameter is a string, which is the type of the exchanges. The
   * default value of the second parameter is "fanout" since we would be making use of the pubsub pattern.
   *
   * @param {string[]} exchanges - An array of exchange names to bind to.
   * @param [exchangeType=fanout] - The type of exchange to use. The default is "fanout".
   *
   * @returns The instance of the class.
   */
  public setExchanges(exchanges: string[], exchangeType = "fanout"): this {
    this.exchanges = exchanges;
    this.exchangeType = exchangeType;

    return this;
  }

  /**
   * It creates a channel, then publishes the message to either an exchange or a queue, depending on
   * whether an exchange was specified.
   *
   * @param {unknown} message - The message to be published.
   * @param {PublishOptions} [options]
   *
   * @returns A promise that resolves when the message has been published.
   */
  public publish(message: unknown, options?: PublishOptions) {
    this.channel = this.connection.createChannel(this.createPublisherPayload());
    const publishOptions = { ...DEFAULT_PUBLISH_OPTIONS, ...options };

    if (this.exchange) {
      return this.publishToExchange(message, publishOptions);
    }

    return this.publishToQueue(message, publishOptions);
  }

  /**
   * It creates a channel, sends a message to a queue, and returns the result.
   *
   * @param {unknown} message - The message to be sent to the queue.
   * @param {PublishOptions} [options]
   *
   * @returns The message is being returned.
   */
  private publishToQueue(message: unknown, options?: PublishOptions) {
    this.channel = this.connection.createChannel(
      this.createSenderPublisherPayload()
    );

    return this.channel.sendToQueue(this.queue, message, options);
  }

  /**
   * It creates a channel, publishes a message to an exchange, and returns the result.
   *
   * @param {unknown} message - The message to be published.
   * @param {PublishOptions} [options]
   *
   * @returns A promise that resolves when the message has been sent to the exchange.
   */
  private publishToExchange(message: unknown, options?: PublishOptions) {
    this.channel = this.connection.createChannel(this.createPublisherPayload());

    return this.channel.publish(this.exchange, "", message, options);
  }

  /**
   * It creates a channel, sets the channel's prefetch count, and then returns the channel's consumer.
   *
   * @param callback - This is the function that will be called when a message is received.
   *
   * @returns The consumer tag.
   */
  public consume(callback: (message: ConsumeMessage) => void) {
    this.channel = this.connection.createChannel(this.getConsumerPayload());

    return this.channel.consume(this.queue, callback);
  }

  /**
   * It acknowledges the message
   *
   * @param {ConsumeMessage} message - The message that was received.
   */
  public ack(message: ConsumeMessage) {
    this.channel.ack(message);
  }

  /**
   * If the exchange is set, then create a payload for a pub/sub publisher, otherwise create a payload
   * for a sender publisher.
   *
   * @returns A function that returns a payload.
   */
  private createPublisherPayload() {
    return this.exchange
      ? this.createPubSubPublisherPayload()
      : this.createSenderPublisherPayload();
  }

  /**
   * It creates a payload object that will be used to create a new RabbitMQ channel.
   *
   * @returns A function that takes a channel as an argument and returns a promise that resolves when
   * the exchange is created.
   */
  private createPubSubPublisherPayload() {
    return {
      json: true,
      setup: (channel: Channel) => {
        return channel.assertExchange(this.exchange, this.exchangeType);
      },
    };
  }

  /**
   * It creates a payload object that will be used to create a RabbitMQ sender publisher.
   *
   * @returns A function that takes a channel as an argument and returns a promise that resolves when
   * the queue is created.
   */
  private createSenderPublisherPayload() {
    return {
      json: true,
      setup: (channel: Channel) => {
        return channel.assertQueue(this.queue, { durable: true });
      },
    };
  }

  /**
   * If the exchanges property is defined, then create a PubSubConsumerPayload, otherwise create a
   * ReceiverConsumerPayload.
   *
   * @returns The payload for the consumer.
   */
  private getConsumerPayload() {
    return this.exchanges
      ? this.createPubSubConsumerPayload()
      : this.createReceiverConsumerPayload();
  }

  /**
   * It creates a payload that will be used to setup the channel and queue
   * @returns A function that takes a channel as an argument and returns a promise that resolves when
   * the queue is created and the prefetch is set.
   */
  private createReceiverConsumerPayload() {
    if (!this.queue) {
      throw new Error("Please set your queue first");
    }

    return {
      setup: (channel: Channel) => {
        return Promise.all([
          channel.assertQueue(this.queue, { durable: true }),
          channel.prefetch(1),
        ]);
      },
    };
  }

  /**
   * It creates a payload for the consumer to use.
   *
   * @returns A promise that resolves to an array of promises.
   */
  private createPubSubConsumerPayload() {
    if (!(this.queue && this.exchanges && this.exchanges.length > 0)) {
      throw new Error(
        "Please set your queue and exchanges to use the PubSub consumer."
      );
    }

    return {
      json: true,
      setup: (channel: Channel) => {
        return Promise.all(
          this.buildExchangeBinding(channel, this.queue, this.exchangeType)
        );
      },
    };
  }

  /**
   * It creates a queue, binds it to all the exchanges, and sets the prefetch count to 1.
   *
   * @param {Channel} channel - The channel we're using to communicate with RabbitMQ
   * @param {string} queue - The name of the queue to bind to the exchange.
   * @param {string} exchangeType - The type of exchange to use.
   *
   * @returns An array of promises.
   */
  private buildExchangeBinding(
    channel: Channel,
    queue: string,
    exchangeType: string
  ) {
    const bindings = [];
    
    bindings.push(channel.assertQueue(queue));

    this.exchanges.forEach(function (exchange) {
      bindings.push(channel.assertExchange(exchange, exchangeType));

      bindings.push(channel.prefetch(1));

      bindings.push(channel.bindQueue(queue, exchange, ""));
    });

    return bindings;
  }
}
