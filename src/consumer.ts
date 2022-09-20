import { NotificationListener } from "./services/listeners/notification.listener";
import { PostListener } from "./services/listeners/post.listener";
import { RMQConnect } from "./services/rabbit-mq.connect";

async function main() {
  try {
    await RMQConnect.connect({
      username: "webdev",
      password: "webdev",
    });
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
