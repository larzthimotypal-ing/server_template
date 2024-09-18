//<--DEPENDENCIES-->//
//Libraries
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
//Utilities
const logger = require("./global/utilities/logger.js");
const { connectDB } = require("./config/db.js");
//Middlewares
const setResponseHeadersMW = require("./global/middlewares/setResponseHeader.mw.js");
const errorMW = require("./global/middlewares/error.mw.js");
const apiLoggerMW = require("./global/middlewares/apiLogger.mw.js");
//Routes
const identity = require("./routes/identity.rts.js");
const elearning = require("./routes/elearning.rts.js");
const { ktcScript } = require("./scripts/createKtcScript.js");
const { createQuizScript } = require("./scripts/createQuizScript.js");
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

createQuizScript();
ktcScript();

app.listen(PORT, () => {
  connectDB();
  logger.info(
    { STATUS: "LISTENING", PORT },
    `Server successfully running on port ${PORT}`
  );
});
