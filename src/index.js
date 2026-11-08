import "./Config/env.config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import messageRouter from "./Modules/Messages/messages.controller.js";
import dbConnection from "./DB/db.connect.js";
import globalErrorHandler from "./Middleware/global-error-handler.middleware.js";

import { redisConnection } from "./common/Clients/redis.client.js";
import { EmailConnection } from "./common/Clients/email.client.js";
import { limiter } from "./Middleware/rate-limit.middleware.js";
import { RATE_LIMIT_CONFIG } from "./common/rate-limit.constant.js";
import requestRouter from "./Modules/Requests/requests.controller.js";
import conversationRouter from "./Modules/Conversations/conversation.controller.js";
import privateConversationRouter from "./Modules/PrivateConversation/privateConversation.controller.js";

const app = express();

app.set("trust proxy", true);

dbConnection();
await redisConnection();
EmailConnection();

// (req, res, next) => {
//   console.log(req.rateLimit);
//   next();
// },

app.use(cors(), helmet(), limiter(RATE_LIMIT_CONFIG.global), express.json());

app.get("/", (req, res) => {
  console.log({ req: req.rateLimit });
  res.json({ message: "Hello World :::::" });
});

app.use("/uploads", express.static("uploads"));

// Router middlewares
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);
app.use("/api/request", requestRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/private-conversation", privateConversationRouter);

// handle Router Not Found
app.use((req, res) => {
  res.status(404).json({ message: "Router Not Found" });
});

// handle Error
app.use(globalErrorHandler);

// Server Connect
console.log("PORT:", process.env.PORT);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${server.address().port}`);
});

server.on("error", (error) => {
  console.error("Server startup error:", error);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running ::");
});
