"use strict";
require("dotenv").config();
const fetchModel = require("./userModel");
const postModel = require("../../post/models");
const { response } = require("express");
const { checkToken } = require("../../utils/checkToken");
const e = require("express");

// USER DATA
const userGetById = async (req, res) => {
  var checkTokenResult = checkToken(req);
  if (checkTokenResult) {
    res.json(checkTokenResult);
  } else {
    const user = await fetchModel.getUserByUserId(req.query.userId);
    console.log("result in controller", user);
    res.json(user);
  }
};

const userGetAll = async (req, res) => {
  var checkTokenResult = checkToken(req);
  console.log("checkTokenResult ", checkTokenResult);
  if (checkTokenResult) {
    res.json(checkTokenResult);
  } else {
    const users = await fetchModel.getAllUsers();
    res.json(users);
  }
};

const userGetAllRecords = async (req, res) => {
  var checkTokenResult = checkToken(req);
  if (checkTokenResult) {
    res.json(checkTokenResult);
  } else {
    const records = await fetchModel.getAllRecordsByUserId(req.query.userId);
    console.log("user records", records);
    res.json(records);
  }
};

module.exports = {
  userGetById,
  userGetAll,
  userGetAllRecords,
};
