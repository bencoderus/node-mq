import { channels } from "./constants/channels.constant";
import { ClientQueueListener } from "./services/listeners/client.listener";
import { EmailQueueListener } from "./services/listeners/email.listener";
import { NotificationQueueListener } from "./services/listeners/notification.listener";
import { RabbitMqConnection } from "./services/rabbit-mq-connection";
import { RabbitMqClient } from "./services/rabbitmq-client";

const connection = RabbitMqConnection.getConnection();

connection.on("disconnect", () => {
  console.log("Disconnected from RabbitMQ.");
  process.exit(0);
});

connection.on("close", () => {
  console.log("Disconnected from RabbitMQ.");
  process.exit(0);
});

const emailQueue = new EmailQueueListener();
const notificationQueue = new NotificationQueueListener();
const clientQueue = new ClientQueueListener();

emailQueue.listen();
notificationQueue.listen();
clientQueue.listen();
