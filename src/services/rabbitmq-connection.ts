import amqp, { AmqpConnectionManager } from "amqp-connection-manager";

export class RMQConnection {
  private static connection: AmqpConnectionManager;

  createConnectionUrl(
    username: string,
    password: string,
    host: string,
    port = 5672
  ) {
    const connectUrl = `amqp://${username}:${password}@${host}:${port}`;

    return connectUrl;
  }

  static getConnection() {
    if (!RMQConnection.connection) {
      const connectionManager = new RMQConnection();
      RMQConnection.connection = connectionManager.connect();
    }

    return RMQConnection.connection;
  }

  connect() {
    const connectionUrl = this.createConnectionUrl(
      process.env.RABBITMQ_USERNAME || "webdev",
      process.env.RABBITMQ_PASSWORD || "webdev",
      process.env.RABBITMQ_HOST || "localhost",
      parseInt(process.env.RABBITMQ_PORT || "5672", 10)
    );

    const connection = amqp
      .connect([connectionUrl])
      .on("connect", () => {
        console.log("Connected to RabbitMQ!");
      })
      .on("connectFailed", (err) => {
        console.log("Connected failed.", err);
      })
      .on("disconnect", (err) => {
        console.log("Disconnected.", err);
      });

    return connection;
  }
}