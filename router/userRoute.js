const express = require("express");
const router = express.Router();
const controller = require("../user/userController");

var middleware = (req, res, next) => {
  if (req.path == "/records") {
    if (req.query.endDate) {
      return controller.userGetRecordFromLastSundayToDate(req, res);
    } else return controller.userGetAllRecords(req, res);
  }
  return next();
};

router.get("/", middleware);
router.get("/info", controller.userGetById);
router.get("/all", controller.userGetAll);
router.get("/records", middleware);
router.put("/", controller.userEditTeamId);

module.exports = router;
