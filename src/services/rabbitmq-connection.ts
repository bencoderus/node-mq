import amqp, {AmqpConnectionManager} from "amqp-connection-manager";

export class RMQConnection {
    private static connection: AmqpConnectionManager;

    static getConnection() {
        if (!RMQConnection.connection) {
            const connectionManager = new RMQConnection();
            RMQConnection.connection = connectionManager.connect();
        }

        return RMQConnection.connection;
    }

    createConnectionUrl(
        username: string,
        password: string,
        host: string,
        port = 5672
    ) {
        return `amqp://${username}:${password}@${host}:${port}`;
    }

    connect() {
        const connectionUrl = this.createConnectionUrl(
            process.env.RABBITMQ_USERNAME || "webdev",
            process.env.RABBITMQ_PASSWORD || "webdev",
            process.env.RABBITMQ_HOST || "localhost",
            parseInt(process.env.RABBITMQ_PORT || "5672", 10)
        );

        return amqp
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
    }
}
