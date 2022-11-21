const express = require("express");
const router = express.Router();
const controller = require("../record/recordController");

router.post("/", controller.postNewRecord);

module.exports = router;
