"use strict";
const express = require("express");
const router = express.Router();
const { login } = require("../authentication/authController");

router.post("/login", login);

module.exports = router;
