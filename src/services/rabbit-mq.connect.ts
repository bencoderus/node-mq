import amqp, { AmqpConnectionManager } from "amqp-connection-manager";
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";

type ConnectionOptions = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  logger?: any;
  delayInSeconds?: number;
  maxRetries?: number;
};

export class RMQConnect {
  private static _connection: AmqpConnectionManager;
  private static _connectionOptions: ConnectionOptions;

  public constructor(private readonly connectionData: ConnectionOptions) {}

  /**
   * It creates a new instance of the RMQConnect class, connects to RabbitMQ, and returns the connection.
   *
   * @param {ConnectionData} connectionData - ConnectionData = {}
   *
   * @returns A promise that resolves to an instance of IAmqpConnectionManager
   */
  static async connect(
    connectionData: ConnectionOptions = {}
  ): Promise<IAmqpConnectionManager> {
    RMQConnect._connectionOptions = connectionData;

    if (!RMQConnect._connection) {
      const rabbit = new RMQConnect(connectionData);

      try {
        RMQConnect._connection = await rabbit.connect();

        return RMQConnect._connection;
      } catch (error) {
        throw error;
      }
    }

    return RMQConnect._connection;
  }

  /**
   * It creates a connection URL, then creates a connection to RabbitMQ using the connection URL, and
   * returns a promise that resolves to the connection.
   *
   * @returns A promise that resolves to an IAmqpConnectionManager
   */
  public async connect(): Promise<IAmqpConnectionManager> {
    const connectionUrl = RMQConnect.createConnectionUrl(this.connectionData);

    return new Promise((resolve, reject) => {
      const connection = amqp.connect([connectionUrl]);

      connection
        .on("connectFailed", (err) => reject(err))
        .on("connect", (connect) => resolve(connection));
    });
  }

  private static async delay(s: number) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }

  public static async connectUntil(
    options: ConnectionOptions
  ): Promise<AmqpConnectionManager> {
    try {
      const connection = await RMQConnect.connect(options);

      return connection;
    } catch (error) {
      const connection = await RMQConnect.reconnect(options);

      return connection;
    }
  }

  public static closeConnection(connection: AmqpConnectionManager) {
    RMQConnect._connection = undefined;

    connection.close();
  }

  public static async reconnect(options: ConnectionOptions): Promise<any> {
    const retries = options.maxRetries || 10;
    const delayInSeconds = options.delayInSeconds || 10;
    const logger = options.logger || console;

    for (let i = 1; i <= retries; i++) {
      await RMQConnect.delay(delayInSeconds);

      try {
        const value = await RMQConnect.connect(options);

        return value;
      } catch (error) {
        if (i === retries) {
          logger.error(error);
        } else {
          logger.error(
            `Unable to connect to RabbitMQ, retrying connection (${i})`
          );
        }

        continue;
      }
    }

    throw new Error("Unable to connect to RabbitMQ.");
  }

  /**
   * It returns the connection object after connecting to RabbitMQ.
   *
   * @returns The connection object.
   */
  public static get connection() {
    return RMQConnect._connection;
  }

  /**
   * It takes a username, password, host, and port, and returns a connection URL.
   *
   * @param {string} username - The username to use when connecting to the RabbitMQ server.
   * @param {string} password - The password for the RabbitMQ user.
   * @param {string} host - The hostname of the RabbitMQ server.
   * @param [port=5672] - The port to connect to. Defaults to 5672.
   *
   * @returns {string}
   */
  private static createConnectionUrl(connection: ConnectionOptions): string {
    const username = connection.username || "guest";
    const password = connection.password || "guest";
    const host = connection.host || "localhost";
    const port = connection.port || 5672;

    return `amqp://${username}:${password}@${host}:${port}`;
  }
}
