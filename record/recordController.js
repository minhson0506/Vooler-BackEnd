"use strict";
require("dotenv").config();
const recordModel = require("./recordModel");
const { httpError } = require("../utils/errors");
const { dateIsValid } = require("../utils/utils");

const jwt = require("jsonwebtoken");

const postNewRecord = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  var uid;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    uid = decoded.uid;
  });

  if (
    typeof req.body.stepCount !== "number" ||
    !dateIsValid(req.body.recordDate)
  ) {
    res.status(400).json({ error: "wrong data format" });
    return;
  }

  const existingEntryForDate = await recordModel.checkExistingEntryForDate(
    req.body.recordDate,
    uid
  );
  console.log("existing entry: ", existingEntryForDate.length);
  if (existingEntryForDate.length !== 0) {
    try {
      const updatedRecord = await recordModel.updateRecord(uid, req.body);
      res.json(updatedRecord);
    } catch (err) {
      res.status(500).json({ error: "cannot update day record" });
      return;
    }
  } else {
    try {
      const newRecord = await recordModel.createNewRecord(uid, req.body);
      res.json(newRecord);
    } catch (err) {
      res.status(500).json({ error: "cannot insert new record" });
      return;
    }
  }
};

module.exports = { postNewRecord };
