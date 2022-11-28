"use strict";
require("dotenv").config();
const fetchModel = require("./userModel");
const jwt = require("jsonwebtoken");

const processUserData = (userDataObject, withEndDate) => {
  var returnObject = {};
  returnObject.uid = userDataObject.map((t) => t.uid)[0];
  returnObject.team_id = userDataObject.map((t) => t.team_id)[0];

  if (withEndDate) {
    returnObject.start_date = userDataObject.map((t) => t.start_date)[0];
    returnObject.end_date = userDataObject.map((t) => t.end_date)[0];
  }
  returnObject.records = userDataObject.map((t) => {
    delete t.team_id;
    delete t.uid;
    delete t.start_date;
    delete t.end_date;
    return t;
  });
  returnObject.total_steps_accumulated = returnObject.records
    .map((t) => t.step_count_for_date)
    .reduce((a, b) => a + b, 0);
  return returnObject;
};

// USER DATA
const userGetById = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  var uid;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("userid decoded", decoded.uid);
    uid = decoded.uid;
  });
  const user = await fetchModel.getUserByUserId(uid);
  delete user.password;
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
  const processedUserDTO = processUserData(records, false);
  console.log("user records", records);
  res.json(processedUserDTO);
};

const userGetRecordFromLastSundayToDate = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  var uid;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("userid decoded", decoded.uid);
    uid = decoded.uid;
  });
  const records = await fetchModel.getRecordsByUidWithEndDate(
    uid,
    req.query.endDate
  );
  const processedUserDTO = processUserData(records, true);
  res.json(processedUserDTO);
};

const userEditInfo = async (req, res, next) => {
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

  const originalUser = await fetchModel.getUserByUserId(uid);
  console.log("originalUser", originalUser);

  var editedUser = {};
  editedUser.uid = uid;
  editedUser.userId = req.body.userId ? req.body.userId : originalUser.user_id;
  editedUser.password = req.body.password
    ? req.body.password
    : originalUser.password;
  editedUser.teamId = req.body.teamId ? req.body.teamId : originalUser.team_id;
  console.log("editedUser", editedUser);

  try {
    await fetchModel.updateUserInfo(editedUser, uid);
    res.status(200).json({ message: "updated userInfo" });
  } catch (e) {
    console.log("edit info for user error", e.message);
    res.status(400).json({ error: "cannot update, recheck input" });
    return;
  }
};

module.exports = {
  userGetById,
  userGetAll,
  userGetAllRecords,
  userGetRecordFromLastSundayToDate,
  userEditInfo,
};
