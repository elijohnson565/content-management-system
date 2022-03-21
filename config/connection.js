require('dotenv').config();
const MySQL = require("mysql2");
const HOST = "localhost";
const PORT = 3306;

const connection = MySQL.createConnection({
  host: HOST,
  port: PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;