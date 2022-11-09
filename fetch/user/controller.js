"use strict";
const model = require("./models");
const { response } = require("express");

// USER DATA
const userGetByName = async (req, res) => {
  const user = await model.getUserByUsername(req.query.user);
  console.log("result in controller", user);
  res.json(user);
};

const userGetAll = async (req, res) => {
  const users = await model.getAllUsers();
  res.json(users);
};

const userGetAllRecords = async (req, res) => {
  const records = await model.getAllRecordsByUserName(req.query.user);
  console.log("user records", records);
  res.json(records);
};

module.exports = {
  userGetByName,
  userGetAll,
  userGetAllRecords,
};
