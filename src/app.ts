import * as express from "express";
import { Request, Response } from "express";
import { UserCreated } from "./services/events/user-created.event";
import { UserUpdated } from "./services/events/user-updated.event";
import { RMQConnect } from "./services/rabbit-mq.connect";
const app = express();

const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000;

app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/broadcast", async (req: Request, res: Response) => {
  const event = new UserCreated();

  await event.publish({
    id: 1,
    name: "Biduwe",
  });

  res.send("Message broad-casted to queues!");
});

app.get("/publish", async (req: Request, res: Response) => {
  const event = new UserUpdated();

  await event.publish({
    id: 1,
    name: "Biduwe",
  });

  res.send("Message broad-casted to queues!");
});

const listen = async () => {
  const connectionData = {
    username: "webdev",
    host: process.env.RABBITMQ_HOST || "localhost",
    password: "webdev",
    maxRetries: 12,
    delayInSeconds: 5,
    logger: console,
  };

  try {
    const mqConnection = await RMQConnect.connectUntil(connectionData);
    app.listen(port);

    process.on("SIGINT", () => mqConnection.close());
    process.on("SIGTERM", () => mqConnection.close());

    mqConnection.on("disconnect", async (error) => {
      RMQConnect.closeConnection(mqConnection);
      process.exit(0);
    });

    console.log("Connected to HTTP server!");
  } catch (error) {
    console.error(error);
  }
};

listen();
