const express = require("express");
const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize("laptop_shop", "root", "Trungtu102", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3060,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection DB has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = connect;
