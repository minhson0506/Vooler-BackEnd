"use strict";
require("dotenv").config();
const fetchModel = require("./userModel");
const jwt = require("jsonwebtoken");

// USER DATA
const userGetById = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  var uid;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("userid decoded", decoded.uid);
    uid = decoded.uid;
  });
  const user = await fetchModel.getUserByUserId(uid);
  console.log("result in controller", user);
  res.json(user);
};

const userGetAll = async (req, res) => {
  const users = await fetchModel.getAllUsers();
  const redactedUsers = users.map((u) => {
    delete u.password;
    delete u.user_id;
    return u;
  });
  res.json(redactedUsers);
};

const userGetAllRecords = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  var uid;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("userid decoded", decoded.uid);
    uid = decoded.uid;
  });
  const records = await fetchModel.getAllRecordsByUserId(uid);
  console.log("user records", records);
  res.json(records);
};

const userGetRecordFromDate = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  var uid;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("userid decoded", decoded.uid);
    uid = decoded.uid;
  });
  const records = await fetchModel.getRecordsByUidAndStartDate(
    uid,
    req.query.startDate
  );
  res.json(records);
};

const userEditTeamId = async (req, res, next) => {
  var uid;
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log("userid decoded", decoded.uid);
      uid = decoded.uid;
    });
  } catch (e) {
    res.status(400).json({ error: "authentication failed" });
  }
  try {
    await fetchModel.updateTeamIdForUid(req.query.userId, req.body.teamId);
    res.status(200).json({ message: "updated teamID" });
  } catch (e) {
    console.log("edit team id for user error", e.message);
    res.status(400).json({ error: "cannot edit teamId, recheck teamId" });
    return;
  }
};

module.exports = {
  userGetById,
  userGetAll,
  userGetAllRecords,
  userGetRecordFromDate,
  userEditTeamId,
};
