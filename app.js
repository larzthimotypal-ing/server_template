//***DEPENDENCIES***//
//Libraries
require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 5000 || process.env.PORT;

app.get("", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`App Listening on PORT ${PORT}`);
});
