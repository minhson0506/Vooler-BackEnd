"use strict";
require("dotenv").config();
const postModel = require("./models");
const fetchModel = require("../fetch/user/userModel");
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

const createUser = async (req, res, next) => {
  try {
    const user = req.body;
    user.user_id = req.body.userId;
    user.team_id = req.body.teamId;

    const usernameExisted = await fetchModel.userIdExisted(req.body.username);
    console.log("existing username", usernameExisted);
    if (usernameExisted.length !== 0) {
      res.json({ message: `Username is taken!`, usernameValid: false });
    } else {
      const newUser = await postModel.createNewUser(user);
      res.json({ message: newUser, usernameValid: true });
    }
  } catch (e) {
    console.log("register new user error", e.message);
    const err = httpError("Error registering new user", 400);
    next(err);
    return;
  }
};

module.exports = { postNewRecord, createUser };
