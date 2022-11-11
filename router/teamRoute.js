const express = require("express");
const router = express.Router();
const controller = require("../fetch/team/controller");

var middleware = (req, res, next) => {
  if (req.query.team_name) return controller.getTeamMembersByTeamName(req, res);
  return next();
};

router.get("/", middleware);
router.get("/", controller.getAllTeams);

module.exports = router;
