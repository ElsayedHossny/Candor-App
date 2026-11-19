import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getIpCountryyGeoIpLite } from "../common/Utils/ip_adress.util.js";
import { client } from "../common/Clients/redis.client.js";
import { RATE_LIMIT_CONFIG } from "../common/rate-limit.constant.js";

export const limiter = ({
  ttl = 15,
  message = "Too many Requests",
  status = 429,
  legacyHeaders = false,
  standardHeaders = true,
  skipSuccessfulRequests,
  skipFailedRequests,
  limits = RATE_LIMIT_CONFIG.global.limits.DEFAULT,
  prefix = "rl:global:",
} = {}) => {
  return rateLimit({
    windowMs: ttl * 60 * 1000,

    limit: (req) => {
      const data = getIpCountryyGeoIpLite(req.ip);
      const country = data?.country;
      return limits[country] ?? limits.DEFAULT;
    },

    legacyHeaders,
    standardHeaders,
    skipSuccessfulRequests,
    skipFailedRequests,
    statusCode: status,

    handler: (req, res, next, options) => {
      return res.status(options.statusCode).send({ message });
    },

    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req.ip, 52);
      return `${ip}::${req.path}`;
    },

    store: new RedisStore({
      sendCommand: (...args) => client.sendCommand(args),
      prefix,
    }),
  });
};
