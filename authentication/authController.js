"use strict";
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { httpError } = require("../utils/errors");
const userModel = require("../user/userModel");
const bcrypt = require("bcryptjs");

const { salt } = require("../salt");

const login = async (req, res, next) => {
  // Check if user is existing:
  const userIdExisted = await userModel.userIdExisted(req.body.userId);
  console.log("existing username", userIdExisted);
  if (userIdExisted.length === 0) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  // If user is not existing, check if userId and password match:
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("local params", err, user, info);
    console.log("login req body", req.body);
    if (err || !user) {
      res.status(401).json({ error: "invalid login credentials" });
      return;
    }
    delete user.user_id;

    req.login(user, { session: false }, (err) => {
      if (err) {
        next(httpError("login error", 400));
        res.status(400).json({ error: "login failed" });
        return;
      }
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
};

const registerUser = async (req, res, next) => {
  try {
    const user = req.body;
    user.user_id = req.body.userId;
    user.password = req.body.password;
    user.team_id = req.body.teamId;

    const userIdExisted = await userModel.userIdExisted(user.user_id);
    console.log("existing username", userIdExisted);
    if (userIdExisted.length !== 0) {
      res.status(403).json({ error: "userId is taken" });
      return;
    } else {
      const newUser = await userModel.createNewUser(user);
      console.log("CREATE NEW USER RESULT IN AUTH ", newUser);
      res.status(201).json({ uid: newUser.uid });
      return;
    }
  } catch (e) {
    console.log("register new user error", e.message);
    res.status(500).json({ error: "cannot register new user" });
    return;
  }
};

const getSalt = (req, res, next) => {
  res.json({ salt: salt });
};

module.exports = {
  login,
  registerUser,
  getSalt,
};
