import express from "express";
import { Request, Response } from "express";
import { channels } from "./constants/channels.constant";
import { MessageQueue } from "./services/rabbit-queue";
import { RabbitMqConnection } from "./services/rabbit-mq-connection";
const app = express();

app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/send", async (req: Request, res: Response) => {
  const body = req.body;
  const queue = MessageQueue.getQueue(channels.NOTIFICATION_QUEUE);

  await queue.publish(body);

  res.send("Message sent to consumer.");
});

app.get("/publish", async (req: Request, res: Response) => {
  const queue = MessageQueue.getQueue(channels.NOTIFICATION_QUEUE);

  await queue.publish({
    message: "Hello World!",
    eventName: "notification:sent",
  });

  res.send("Message sent to consumers of the queue.");
});

app.get("/email", async (req: Request, res: Response) => {
  const queue = MessageQueue.getQueue(channels.EMAIL_QUEUE);

  await queue.publish({
    subject: "Hello Benjamin",
    body: "Hello Benjamin, I just sent a mail.",
    eventName: "email:sent",
  });

  res.send("Email sent to consumers of the queue.");
});

app.listen(3000, () => {
  RabbitMqConnection.getConnection();
  console.log("Connected to HTTP server!");
});
