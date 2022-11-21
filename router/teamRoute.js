const express = require("express");
const router = express.Router();
const controller = require("../team/teamController");

var middleware = (req, res, next) => {
  if (req.query.teamId && !req.query.startDate)
    return controller.getTeamMembersByTeamId(req, res, next);
  else if (req.query.teamId && req.query.startDate)
    return controller.getTeamInfoWithStartDate(req, res, next);

  return next();
};

router.get("/", middleware);
router.get("/", controller.getAllTeams);

module.exports = router;
