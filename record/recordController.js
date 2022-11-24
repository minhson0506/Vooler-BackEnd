"use strict";
require("dotenv").config();
const recordModel = require("./recordModel");
const { httpError } = require("../utils/errors");
const jwt = require("jsonwebtoken");

const postNewRecord = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  var uid;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("userid decoded", decoded.uid);
    uid = decoded.uid;
  });
  const existingEntryForDate = await recordModel.checkExistingEntryForDate(
    req.body.recordDate,
    uid
  );
  console.log("existing entry: ", existingEntryForDate.length);
  if (existingEntryForDate.length !== 0) {
    res.status(409).json({ error: "record for date existed" });
  }
  try {
    const newRecord = await recordModel.createNewRecord(uid, req.body);
    res.json(newRecord);
  } catch (err) {
    res.status(400).json({ error: "cannot insert new record" });
    return;
  }
};

module.exports = { postNewRecord };
