const express = require("express");
const router = express.Router();
const controller = require("../user/userController");

var middleware = (req, res, next) => {
  if (req.path == "/records" && req.query.userId) {
    if (req.query.startDate) {
      return controller.userGetRecordFromDate(req, res);
    } else return controller.userGetAllRecords(req, res);
  } else if (req.query.userId) return controller.userGetById(req, res);
  return next();
};

router.get("/", middleware);
router.get("/", controller.userGetAll);
router.get("/records", middleware);

module.exports = router;
