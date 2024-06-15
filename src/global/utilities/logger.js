import pino from "pino";

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// comment pino/file
const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: {
        destination: `${__dirname}../../../app.log`,
      },
      level: process.env.FILE_LOG_LEVEL || "info",
    },
    {
      target: "pino-pretty",
      level: process.env.CONSOLE_LOG_LEVEL || "info",
    },
  ],
});

const logger = pino(
  {
    level: process.env.CONSOLE_LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export default logger;
