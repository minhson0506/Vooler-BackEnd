"use strict";
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { httpError } = require("../utils/errors");
const userModel = require("../user/userModel");
const bcrypt = require("bcryptjs");

const { salt } = require("../salt");

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("local params", err, user, info);
    console.log("login req body", req.body);
    if (err || !user) {
      next(httpError("Invalid login credentials", 401));
      return;
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        next(httpError("login error", 400));
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
      const err = httpError(`UserID is taken!`, 403);
      next(err);
      return;
      // res.json({ message: `UserID is taken!`, usernameValid: false });
    } else {
      const newUser = await userModel.createNewUser(user);
      console.log("CREATE NEW USER RESULT IN AUTH ", newUser);
      res.json({ message: newUser, usernameValid: true });
    }
  } catch (e) {
    console.log("register new user error", e.message);
    const err = httpError(
      `Error registering new user, recheck register info`,
      400
    );
    next(err);
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
