"use strict";
require("dotenv").config();
const model = require("./teamModel");
const { httpError } = require("../utils/errors");

const getAllTeams = async (req, res) => {
  const teams = await model.getAllTeams();
  res.json(teams);
};

const processTeamData = (teamDataObject, withStartDate) => {
  var returnObject = {};
  returnObject.team_name = teamDataObject.map((t) => t.team_name)[0];
  returnObject.team_id = teamDataObject.map((t) => t.team_id)[0];
  if (withStartDate) {
    returnObject.total_team_steps_from_start_date = teamDataObject
      .map((t) => t.total_step_from_startDate)
      .reduce((a, b) => a + b, 0);
  } else {
    returnObject.total_team_steps_last_7_days = teamDataObject
      .map((t) => t.total_step_last_7_days)
      .reduce((a, b) => a + b, 0);
  }
  returnObject.team_members = teamDataObject.map((t) => {
    delete t.team_id;
    delete t.team_name;
    delete t.step_userId;
    return t;
  });
  return returnObject;
};

const getTeamMembersByTeamId = async (req, res, next) => {
  const teamMembers = await model.getTeamInfoByTeamId(req.query.teamId);
  if (teamMembers.length === 0) {
    res.status(400).json({ error: "invalid teamId" });
    return;
  }
  const returnObject = processTeamData(teamMembers, false);
  console.log("result in controller", returnObject);
  res.json(returnObject);
};

const getTeamInfoWithStartDate = async (req, res, next) => {
  const teamMembers = await model.getTeamInfoWithStartDate(
    req.query.teamId,
    req.query.startDate
  );
  if (teamMembers.length === 0) {
    res.status(400).json({ error: "invalid teamId" });
    return;
  }
  const returnObject = processTeamData(teamMembers, true);
  console.log("result in controller", returnObject);
  res.json(returnObject);
};

module.exports = {
  getAllTeams,
  getTeamMembersByTeamId,
  getTeamInfoWithStartDate,
};
