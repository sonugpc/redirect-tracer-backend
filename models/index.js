// models/index.js

const mysql = require("mysql2/promise");
const config = require("../config");

let connection;

async function initializeDatabase() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: config.DBHOST,
      user: config.DBUSER,
      password: config.DBPASSWORD,
      database: config.DBNAME,
    });
    console.log("Connected to the MySQL server.");
  }
  return connection;
}

function getConnection() {
  if (!connection) {
    throw new Error("Database connection not initialized.");
  }
  return connection;
}

module.exports = {
  initializeDatabase,
  getConnection,
};
