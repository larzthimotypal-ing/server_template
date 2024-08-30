//<--DEPENDENCIES-->//
//Libraries
import dotenv from "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
//Utilities
import logger from "./global/utilities/logger.js";
//Middlewares
import setResponseHeadersMW from "./global/middlewares/setResponseHeader.mw.js";
import errorMW from "./global/middlewares/error.mw.js";
import apiLoggerMW from "./global/middlewares/apiLogger.mw.js";
//Routes
import identity from "./routes/identity.rts.js";
import elearning from "./routes/elearning.rts.js";
//<--DEPENDENCIES-->//

const app = express();
const PORT = 5000 || process.env.PORT;

//express config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(setResponseHeadersMW);
app.use(cors());
app.use(apiLoggerMW);

//Home
app.get("/", (req, res) => {
  res.send("REST API Authentication and Authorization");
});

//Routes
app.use("/api", identity);
app.use("/api/elearning", elearning);

//Error Middleware
app.use(errorMW);

app.listen(PORT, () => {
  logger.info(
    { STATUS: "LISTENING", PORT },
    `Server successfully running on port ${PORT}`
  );
});
