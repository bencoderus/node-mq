import * as express from "express";
import { Request, Response } from "express";
import { RabbitMqConnection } from "./services/rabbit-mq-connection";
import * as util from "util";
import { EmailSent } from "./services/events/email-sent.event";
import { NotificationSent } from "./services/events/notification.event";
const app = express();

app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/publish", async (req: Request, res: Response) => {
  const event = new NotificationSent();

  event.publish({
    message: "Hello World!",
  });

  res.send("Message sent to consumers of the queue.");
});

app.get("/email", async (req: Request, res: Response) => {
  const event = new EmailSent();

  await event.publish({
    subject: "Hello Benjamin",
    body: "Hello Benjamin, I just sent a mail.",
    to: "bencoderus@gmail.com",
  });

  res.send("Email sent to consumers of the queue.");
});

app.listen(3000, () => {
  const connection = RabbitMqConnection.getConnection();

  connection.on("disconnect", () => {
    console.log("Disconnected from RabbitMQ.");
    process.exit(0);
  });

  console.log("Connected to HTTP server!");
});
