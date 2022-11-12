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
    console.error(`Error while adding record `, err.message);
    next(err);
    return;
  }
};

module.exports = { postNewRecord };
