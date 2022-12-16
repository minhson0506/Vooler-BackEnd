"use strict";
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { getUserLogin } = require("../user/userModel");
const bcrypt = require("bcryptjs");

const { salt } = require("../salt");
const { getHash } = require("../utils/getHash");
// local strategy for userId password login

passport.use(
  new Strategy(
    {
      usernameField: "userId",
      passwordField: "password",
    },
    async (userId, password, done) => {
      try {
        const [user] = await getUserLogin(userId);
        if (!user) {
          return done(null, false, { message: "Incorrect user Id" });
        }
        if (password != user.password) {
          return done(null, false, { message: "Incorrect password." });
        }
        delete user.password;
        return done(null, { ...user }, { message: "Logged In Successfully" }); // use spread syntax to create shallow copy to get rid of binary row type
      } catch (err) {
        return done(err);
      }
    }
  )
);

// allows only requests with valid tokens to access some routes needing authentication
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
    }
  )
);

module.exports = passport;
