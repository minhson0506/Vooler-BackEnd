const express = require("express");
const router = express.Router();
const controller = require("../team/teamController");
const passport = require("../utils/passport");

var middleware = (req, res, next) => {
  if (req.query.teamId && !req.query.startDate)
    return controller.getTeamMembersByTeamId(req, res, next);
  else if (req.query.teamId && req.query.startDate)
    return controller.getTeamInfoWithStartDate(req, res, next);

  return next();
};

router.get("/", passport.authenticate("jwt", { session: false }), middleware);
router.get("/all", controller.getAllTeams);

module.exports = router;
