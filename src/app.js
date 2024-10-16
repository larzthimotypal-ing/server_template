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
const https = require("https");
//Routes
const identity = require("./routes/identity.rts.js");
const elearning = require("./routes/elearning.rts.js");
const { ktcScript } = require("./scripts/createKtcScript.js");
const { createQuizScript } = require("./scripts/createQuizScript.js");
//<--DEPENDENCIES-->//

const app = express();
const PORT = 10000 || process.env.PORT;

const STORAGE_DIR = "/opt/render/project/.render/chrome";
const DEB_PATH = path.join(
  STORAGE_DIR,
  "google-chrome-stable_current_amd64.deb"
);
const CHROME_DOWNLOAD_URL =
  "https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb";

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

// Download the .deb file with retries
const downloadChrome = async (url, dest, retries = 3) => {
  console.log(`Downloading Chrome from ${url}...`);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(
          new Error(`Failed to download Chrome. Status: ${response.statusCode}`)
        );
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(resolve); // Close the file and resolve
      });

      file.on("error", async (error) => {
        console.error("Download error:", error);
        fs.unlinkSync(dest); // Delete the incomplete file

        if (retries > 0) {
          console.log("Retrying download...");
          await downloadChrome(url, dest, retries - 1); // Retry download
        } else {
          reject(
            new Error("Failed to download Chrome after multiple attempts.")
          );
        }
      });
    });
  });
};

const setupChrome = async () => {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      console.log("...Setting up Chrome");
      fs.mkdirSync(STORAGE_DIR, { recursive: true });

      // Download Chrome .deb package with retries
      await downloadChrome(CHROME_DOWNLOAD_URL, DEB_PATH);

      // Verify that the .deb file exists and is non-empty
      const stats = fs.statSync(DEB_PATH);
      if (stats.size === 0) {
        throw new Error("Downloaded .deb file is empty. Aborting.");
      }

      // Extract the .deb package
      await execCommand(`dpkg -x ${DEB_PATH} ${STORAGE_DIR}`);

      // Clean up the .deb package
      fs.unlinkSync(DEB_PATH);
      console.log("Chrome setup complete.");
    } else {
      console.log("...Using Chrome from cache");
    }

    // Return to original directory
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

app.get("/check-chrome", async (req, res) => {
  const chromePath = "/tmp/puppeteer_cache/chrome-linux/chrome";

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
