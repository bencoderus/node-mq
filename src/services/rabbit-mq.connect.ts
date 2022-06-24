import amqp, { AmqpConnectionManager } from "amqp-connection-manager";
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";

type ConnectionData = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
};

export class RMQConnect {
  private static _connection: AmqpConnectionManager;

  public constructor(private readonly connectionData: ConnectionData) {}

  /**
   * It creates a new instance of the RMQConnect class, connects to RabbitMQ, and returns the connection.
   *
   * @param {ConnectionData} connectionData - ConnectionData = {}
   *
   * @returns A promise that resolves to an instance of IAmqpConnectionManager
   */
  static async connect(
    connectionData: ConnectionData = {}
  ): Promise<IAmqpConnectionManager> {
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
    const connectionUrl = this.createConnectionUrl(
      this.connectionData.username || "guest",
      this.connectionData.password || "guest",
      this.connectionData.host || "localhost",
      this.connectionData.port || 5672
    );

    return new Promise((resolve, reject) => {
      const connection = amqp.connect([connectionUrl]);

      connection
        .on("connectFailed", (err) => reject(err))
        .on("disconnect", (err) => reject(err))
        .on("connect", (connect) => resolve(connection));
    });
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
  private createConnectionUrl(
    username: string,
    password: string,
    host: string,
    port = 5672
  ): string {
    return `amqp://${username}:${password}@${host}:${port}`;
  }
}
