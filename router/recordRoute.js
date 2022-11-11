const express = require("express");
const router = express.Router();
const controller = require("../post/controller");

router.post("/", controller.postNewRecord);

module.exports = router;
