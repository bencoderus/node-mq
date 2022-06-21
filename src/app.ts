import * as express from "express";
import { Request, Response } from "express";
import { RMQConnection } from "./services/rabbitmq-connection";
import { EmailSent } from "./services/events/email-sent.event";
import { NotificationSent } from "./services/events/notification.event";
import { ClientCreated } from "./services/events/client-created.event";
import { TradeExecuted } from "./services/events/trade-executed.event";
const app = express();

app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/broadcast", async (req: Request, res: Response) => {
  const event = new ClientCreated();

  await event.publish({
    id: 1,
    name: "Biduwe",
  });

  res.send("Message broad-casted to queues!");
});

app.get("/trade", async (req: Request, res: Response) => {
  const event = new TradeExecuted();

  await event.publish({
    id: 1,
    name: "Traders Inc",
  });

  res.send("Message broad-casted to queues!");
});

app.get("/publish", async (req: Request, res: Response) => {
  const event = new NotificationSent();

  await event.publish({
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
  const connection = RMQConnection.getConnection();

  connection.on("disconnect", () => {
    console.log("Disconnected from RabbitMQ.");
    process.exit(0);
  });

  console.log("Connected to HTTP server!");
});
