import "./Config/env.config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";

import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import messageRouter from "./Modules/Messages/messages.controller.js";
import dbConnection from "./DB/db.connect.js";
import globalErrorHandler from "./Middleware/global-error-handler.middleware.js";
import { redisConnection } from "./common/Clients/redis.client.js";
import { EmailConnection } from "./common/Clients/email.client.js";

import axios from "axios";

import geoip from "geoip-lite";

const app = express();

app.set("trust proxy", true);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: async (req) => {
    // const { country_code: country } = await getIpCountryByIpApi(req.ip);
    const data = getIpCountryyGeoIpLite(req.ip);
    switch (data.country) {
      case "EG":
        return 10;
      case "US":
        return 3;
      default:
        return 5;
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // ipv6Subnet: 52, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // message: { message: "Too many Request.." },
  // statusCode: 400,
  // skipSuccessfulRequests: true,
  handler: (req, res, next, options) => {
    return res
      .status(options.statusCode)
      .send({ message: "Too many Request.." });
  },
  keyGenerator: (req, res) => {
    console.log(req.ip);
    const ip = ipKeyGenerator(req.ip, 52);
    return `${ip}::${req.path}`;
  },
});

async function getIpCountryByIpApi(ip) {
  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

function getIpCountryyGeoIpLite(ip) {
  return geoip.lookup(ip);
}

app.use(cors(), helmet(), limiter, express.json());

dbConnection();
redisConnection();
EmailConnection();

app.get("/", (req, res) => {
  console.log({ req: req.rateLimit });
  res.json({ message: "Hello World :::::" });
});

app.use("/uploads", express.static("uploads"));

// Router middlewares
app.use("/api/auth", authRouter);
app.use(
  "/api/user",
  (req, res, next) => {
    console.log(req.rateLimit);
    next();
  },
  userRouter,
);
app.use("/api/message", messageRouter);

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
