"use strict";
const express = require("express");
const router = express.Router();
const { login, registerUser } = require("../authentication/authController");
const { route } = require("./userRoute");

router.post("/login", login);
router.post("/register", registerUser);
module.exports = router;
