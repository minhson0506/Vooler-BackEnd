const express = require("express");
const router = express.Router();
const controller = require("../team/teamController");

var middleware = (req, res, next) => {
  if (req.query.teamId) return controller.getTeamMembersByTeamId(req, res);
  return next();
};

router.get("/", middleware);
router.get("/", controller.getAllTeams);

module.exports = router;
