import { ClientConsumer } from "./services/listeners/client.consumer";
import { EmailConsumer } from "./services/listeners/email.consumer";
import { NotificationConsumer } from "./services/listeners/notification.consumer";
import { TradeConsumer } from "./services/listeners/trade.consumer";
import { RMQConnect } from "@liquidator/common";

async function main() {
  try {
    const connection = await RMQConnect.connect({
      host: process.env.RABBITMQ_HOST || "localhost",
      username: "webdev",
      password: "webdev",
    });
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
  console.log("Waiting for message");

  const emailQueue = new EmailConsumer();
  const tradeQueue = new TradeConsumer();
  const notificationQueue = new NotificationConsumer();
  const clientQueue = new ClientConsumer();

  emailQueue.listen();
  notificationQueue.listen();
  clientQueue.listen();
  tradeQueue.listen();
}

main();
