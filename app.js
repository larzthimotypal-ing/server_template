//<--DEPENDENCIES-->//
//Libraries
import dotenv from "dotenv/config";
import express from "express";

//Utilities
import { logger } from "./logger.js";
//<--DEPENDENCIES-->//

const app = express();
const PORT = 5000 || process.env.PORT;

app.get("", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  logger.info(
    { STATUS: "LISTENING", PORT },
    `Server successfully running on port ${PORT}`
  );
});
