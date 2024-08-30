import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: process.env.HOST || "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })
  .promise();
