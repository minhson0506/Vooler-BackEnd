"use strict";
const model = require("./models");
const { response } = require("express");
const { getTotalStepsLastSevenDays } = require("../user/models");

const getAllTeams = async (req, res) => {
  const teams = await model.getAllTeams();
  res.json(teams);
};

const getTeamMembersByTeamName = async (req, res) => {
  var returnObject = {};
  const teamMembers = await model.getTeamInfoByTeamName(req.query.team_name);
  returnObject.team_id = teamMembers.map((t) => t.team_id)[0];
  returnObject.team_name = req.query.team_name;
  returnObject.total_team_steps_last_7_days = teamMembers
    .map((t) => t.total_step_last_7_days)
    .reduce((a, b) => a + b, 0);
  returnObject.team_members = teamMembers.map((t) => {
    delete t.team_id;
    delete t.team_name;
    return t;
  });

  console.log("result in controller", returnObject);
  res.json(returnObject);
};

module.exports = { getAllTeams, getTeamMembersByTeamName };
