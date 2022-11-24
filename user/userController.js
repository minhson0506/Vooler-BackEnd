"use strict";
require("dotenv").config();
const fetchModel = require("./userModel");
const e = require("express");
const { httpError } = require("../utils/errors");

// USER DATA
const userGetById = async (req, res) => {
  const user = await fetchModel.getUserByUserId(req.query.userId);
  console.log("result in controller", user);
  res.json(user);
};

const userGetAll = async (req, res) => {
  const users = await fetchModel.getAllUsers();
  const redactedUsers = users.map((u) => {
    delete u.password;
    return u;
  });
  res.json(redactedUsers);
};

const userGetAllRecords = async (req, res) => {
  const records = await fetchModel.getAllRecordsByUserId(req.query.userId);
  console.log("user records", records);
  res.json(records);
};

const userGetRecordFromDate = async (req, res) => {
  const records = await fetchModel.getRecordsByUserIdAndStartDate(
    req.query.userId,
    req.query.startDate
  );
  res.json(records);
};

const userEditTeamId = async (req, res, next) => {
  try {
    await fetchModel.updateTeamIdForUserId(req.query.userId, req.body.teamId);
    res.json({ message: "Updated teamID" });
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
