import { NotificationListener } from "./services/listeners/notification.listener";
import { PostListener } from "./services/listeners/post.listener";
import { RMQConnect } from "./services/rabbit-mq.connect";

async function main() {
  console.log(process.env.RABBITMQ_HOST || "localhost");

  try {
    const connectionData = {
      username: "webdev",
      host: process.env.RABBITMQ_HOST || "localhost",
      password: "webdev",
      maxRetries: 12,
      delayInSeconds: 5,
      logger: console,
    };

    await RMQConnect.connect(connectionData);
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
  console.log("Waiting for message");

  const notificationListener = new NotificationListener();
  notificationListener.consume();

  const postListener = new PostListener();
  postListener.consume();
}

main();
