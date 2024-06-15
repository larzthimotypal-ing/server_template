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
//Routes
import example from "./routes/example.rts.js";
import apiLoggerMW from "./global/middlewares/apiLogger.mw.js";
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

//Routes
app.use("/api/example", example);

//Error Middleware
app.use(errorMW);

app.listen(PORT, () => {
  logger.info(
    { STATUS: "LISTENING", PORT },
    `Server successfully running on port ${PORT}`
  );
});
