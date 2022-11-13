"use strict";
require("dotenv").config();
const fetchModel = require("./userModel");
const postModel = require("../record/recordModel");
const e = require("express");

// USER DATA
const userGetById = async (req, res) => {
  const user = await fetchModel.getUserByUserId(req.query.userId);
  console.log("result in controller", user);
  res.json(user);
};

const userGetAll = async (req, res) => {
  const users = await fetchModel.getAllUsers();
  res.json(users);
};

const userGetAllRecords = async (req, res) => {
  const records = await fetchModel.getAllRecordsByUserId(req.query.userId);
  console.log("user records", records);
  res.json(records);
};

module.exports = {
  userGetById,
  userGetAll,
  userGetAllRecords,
};
