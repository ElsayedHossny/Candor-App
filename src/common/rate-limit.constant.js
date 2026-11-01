export const RATE_LIMIT_CONFIG = {
  global: {
    ttl: 15,
    prefix: "rl:global:",
    limits: {
      EG: 1000,
      US: 30,
      DEFAULT: 50,
    },
  },

  login: {
    ttl: 5,
    prefix: "rl:login:",
    limits: {
      EG: 10,
      US: 5,
      DEFAULT: 3,
    },
  },

  otp: {
    ttl: 60,
    prefix: "rl:otp:",
    limits: {
      EG: 5,
      US: 3,
      DEFAULT: 2,
    },
  },
};
