"use strict";
require("dotenv").config();
const postModel = require("./recordModel");
const fetchModel = require("../user/userModel");
const { response } = require("express");
const { httpError } = require("../utils/errors");

const postNewRecord = async (req, res, next) => {
  try {
    const newRecord = await postModel.createNewRecord(req.body);
    res.json(newRecord);
  } catch (err) {
    const error = httpError(`Error adding new record, check user info`, 400);
    next(error);
    return;
  }
};

module.exports = { postNewRecord };
