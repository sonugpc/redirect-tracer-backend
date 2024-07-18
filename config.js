const { configDotenv } = require("dotenv");

configDotenv();

const config = {
  env: process.env.NODE_ENV || "development",
  DBUSER: process.env.DBUSER,
  DBPASSWORD: process.env.PASSWORD,
  DBHOST: process.env.SERVER,
  DBNAME: process.env.DB,
  DBPORT: process.env.DBPORT || "5506",
};

module.exports = config;
