const express = require("express");
const router = express.Router();
const controller = require("../fetch/user/controller");

var middleware = (req, res, next) => {
  if (req.path == "/records" && req.query.user)
    return controller.userGetAllRecords(req, res);
  else if (req.query.user) return controller.userGetByName(req, res);
  else if (req.query.team) return controller.teamGetByName(req, res);

  return next();
};

router.get("/", middleware);
router.get("/", controller.userGetAll);
router.get("/records", middleware);

module.exports = router;

//TODO: get user record within date
