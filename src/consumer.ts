import { channels } from "./constants/channels.constant";
import { ClientQueueListener } from "./services/listeners/client.listener";
import { EmailQueueListener } from "./services/listeners/email.listener";
import { NotificationQueueListener } from "./services/listeners/notification.listener";
import { TradeQueueListener } from "./services/listeners/trade.listener";
import { RMQConnection } from "./services/rabbitmq-connection";

const connection = RMQConnection.getConnection();

connection.on("disconnect", () => {
  console.log("Disconnected from RabbitMQ.");
  process.exit(0);
});

connection.on("close", () => {
  console.log("Disconnected from RabbitMQ.");
  process.exit(0);
});

const emailQueue = new EmailQueueListener();
const tradeQueue = new TradeQueueListener();
const notificationQueue = new NotificationQueueListener();
const clientQueue = new ClientQueueListener();

emailQueue.listen();
notificationQueue.listen();
clientQueue.listen();
tradeQueue.listen();
