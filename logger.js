import pino from "pino";

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: { destination: `${__dirname}/app.log` },
    },
    {
      target: "pino-pretty",
    },
  ],
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);
