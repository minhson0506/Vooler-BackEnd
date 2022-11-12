"use strict";
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { getUserLogin } = require("../user/userModel");

// local strategy for userId password login
passport.use(
  new Strategy(
    {
      usernameField: "userId",
      passwordField: "password",
    },
    async (userId, password, done) => {
      const params = [userId];
      try {
        const [user] = await getUserLogin(params);
        console.log("Local strategy", user); // result is binary row
        if (!user) {
          return done(null, false, { message: "Incorrect user Id." });
        }
        if (user.password !== password) {
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
      console.log("jwtpayload", jwtPayload);
      return done(null, jwtPayload);
    }
  )
);

module.exports = passport;
