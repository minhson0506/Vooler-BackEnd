"use strict";
require("dotenv").config();
const postModel = require("./recordModel");
const { httpError } = require("../utils/errors");

const postNewRecord = async (req, res, next) => {
  try {
    const newRecord = await postModel.createNewRecord(req.body);
    res.json(newRecord);
  } catch (err) {
    res.status(400).json({ error: "cannot insert new record" });
    return;
  }
};

module.exports = { postNewRecord };
