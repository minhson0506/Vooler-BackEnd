"use strict";
const express = require("express");
const router = express.Router();
const {
  login,
  registerUser,
  getSalt,
} = require("../authentication/authController");

router.post("/login", login);
router.post("/register", registerUser);
router.get("/salt", getSalt);
module.exports = router;
