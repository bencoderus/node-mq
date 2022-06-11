import { ChannelWrapper } from "amqp-connection-manager";
import { ConsumeMessage } from "amqplib";
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";

export class RabbitMq {
  private channelName: string;
  private channelWrapper: ChannelWrapper;

  constructor(connection: IAmqpConnectionManager, channelName: string) {
    this.channelName = channelName;
    this.channelWrapper = connection.createChannel({
      json: true,
      setup: (channel: any) => {
        return channel.assertQueue(channelName, { durable: true });
      },
    });
  }

  public async publish(message: any): Promise<boolean> {
    return this.channelWrapper.sendToQueue(this.channelName, message);
  }

  public consume(callback: (message: ConsumeMessage) => void) {
    this.channelWrapper.consume(this.channelName, callback);
  }

  public ack(message: ConsumeMessage) {
    this.channelWrapper.ack(message);
  }
}
