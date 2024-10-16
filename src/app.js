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
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
//Routes
const identity = require("./routes/identity.rts.js");
const elearning = require("./routes/elearning.rts.js");
const { ktcScript } = require("./scripts/createKtcScript.js");
const { createQuizScript } = require("./scripts/createQuizScript.js");
//<--DEPENDENCIES-->//

const app = express();
const PORT = 10000 || process.env.PORT;

const STORAGE_DIR = "/opt/render/project/.render/chrome";
// Function to execute shell commands
const execCommand = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      } else if (stderr) {
        console.error(`Stderr: ${stderr}`);
        resolve(stderr);
      } else {
        console.log(`Stdout: ${stdout}`);
        resolve(stdout);
      }
    });
  });

// Function to download Chrome if not already cached
const setupChrome = async () => {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      console.log("...Downloading Chrome");
      fs.mkdirSync(STORAGE_DIR, { recursive: true });

      // Change directory to the storage path
      process.chdir(STORAGE_DIR);

      // Download Chrome .deb package
      await execCommand(
        "wget -P ./ https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
      );

      // Extract the .deb package
      await execCommand(
        `dpkg -x ./google-chrome-stable_current_amd64.deb ${STORAGE_DIR}`
      );

      // Clean up the .deb package
      await execCommand("rm ./google-chrome-stable_current_amd64.deb");

      console.log("Chrome setup complete.");
    } else {
      console.log("...Using Chrome from cache");
    }

    // Change back to the original project directory
    process.chdir(path.resolve(__dirname));
  } catch (error) {
    console.error("Error setting up Chrome:", error);
    throw error;
  }
};

// Call the setup function
setupChrome()
  .then(() => {
    console.log("Chrome is ready to use.");
  })
  .catch((error) => {
    console.error("Failed to setup Chrome:", error);
  });

app.get("/check-chrome", async (req, res) => {
  const chromePath = "/opt/render/project/.render/chrome";

  try {
    if (fs.existsSync(chromePath)) {
      res.send("Chromium found at: " + chromePath);
    } else {
      res.status(404).send("Chromium NOT found in /tmp.");
    }
  } catch (error) {
    res.status(500).send("Error checking Chromium: " + error.message);
  }
});

//express config
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
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
