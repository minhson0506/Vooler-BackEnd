"use strict";
require("dotenv").config();

const checkToken = (req) => {
  if (!req.headers["x-access-token"]) {
    return { message: "missing token" };
  }
  if (req.headers["x-access-token"] !== process.env.API_TOKEN) {
    return { message: "invalid token" };
  }
  return;
};

module.exports = { checkToken };
