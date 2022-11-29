"use strict";
require("dotenv").config();
const model = require("./teamModel");

const processTeamData = (teamDataObject, withEndDate) => {
  var returnObject = {};
  returnObject.team_name = teamDataObject.map((t) => t.team_name)[0];
  returnObject.team_id = teamDataObject.map((t) => t.team_id)[0];
  if (withEndDate) {
    returnObject.start_date = teamDataObject.map((t) => t.start_date)[0];
    returnObject.end_date = teamDataObject.map((t) => t.end_date)[0];
    returnObject.total_team_steps_accumulated = teamDataObject
      .map((t) => t.total_steps_accumulated)
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
    delete t.user_id;
    if (withEndDate) {
      delete t.start_date;
      delete t.end_date;
    }
    return t;
  });
  return returnObject;
};

const getAllTeams = async (req, res) => {
  const teams = await model.getAllTeams();
  res.json(teams);
};

const getAllTeamsStepDataWithEndDate = async (req, res, next) => {
  try {
    const teams = await model.getAllTeamsStepDataWithEndDate(req.query.endDate);
    var returnObject = {};
    returnObject.start_date = teams.map((t) => t.start_date)[0];
    returnObject.end_date = teams.map((t) => t.end_date)[0];
    returnObject.teams = teams.map((t) => {
      delete t.start_date;
      delete t.end_date;
      return t;
    });
    console.log("returnObject", returnObject);
    res.json(returnObject);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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

const getTeamInfoWithEndDate = async (req, res, next) => {
  const teamMembers = await model.getTeamInfoWithEndDate(
    req.query.teamId,
    req.query.endDate
  );
  console.log("team info: ", teamMembers);
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
  getTeamInfoWithEndDate,
  getAllTeamsStepDataWithEndDate,
};
