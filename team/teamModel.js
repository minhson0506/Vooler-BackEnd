"use strict";
const { createDbConnection } = require("../db");

let db = createDbConnection();

const getAllTeams = async () => {
  try {
    var results = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM teams`, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.team_name);
        });
        resolve(rows);
      });
    });
    console.log("ret in model", results);
    return results;
  } catch (e) {
    console.log(e);
  }
};

const getAllTeamsStepDataWithEndDate = (endDate) => {
  const query = `
    SELECT
    team_id,
    team_name,
    sum(total_steps_accumulated) as total_team_steps_accumulated,
    (SELECT DATE(?, '-7 day', 'weekday 0')) as start_date,
    (SELECT DATE(? )) as end_date 
  FROM (
    SELECT
      uid,
      u.team_id,
      team_name
    FROM
      users u
    LEFT JOIN teams t
  WHERE
    u.team_id = t.team_id) AS t1
    JOIN (
      SELECT
        user_id, SUM(step_count) AS total_steps_accumulated
      FROM
        step_data
      WHERE
        record_date >= (
          SELECT
            DATE(?, '-7 day', 'weekday 0'))
          AND record_date < (
            SELECT
              (DATE(?, '+1 day')))
          GROUP BY
            user_id) AS t2 
    ON t1.uid = t2.user_id
  GROUP BY
    team_id;`;
  var team = new Promise((resolve, reject) => {
    db.all(query, [endDate, endDate, endDate, endDate], (error, rows) => {
      if (error) {
        throw error;
      }
      resolve(rows);
    });
  });
  console.log("result in model", team);

  return team;
};

const teamInfoQuery = (dateCondition, stepColumnName) => {
  const sqlString = `SELECT
      *
    FROM (
      SELECT
        u.uid,
        t.team_id,
        team_name
      FROM
        users u
      LEFT JOIN teams t
    WHERE
      u.team_id = t.team_id
      AND t.team_id = ?) AS t1
      LEFT JOIN (
        SELECT
          user_id AS step_userId , SUM(step_count) AS ${stepColumnName}
        FROM
          step_data
        WHERE
          record_date >= ${dateCondition}
          GROUP BY
            user_id) AS t2 ON t1.uid = t2.step_userId;`;
  return sqlString;
};

const getTeamInfoByTeamId = async (teamId) => {
  const query = teamInfoQuery(
    `(
    SELECT
        DATETIME ('now', '-7 day'))`,
    "total_step_last_7_days"
  );
  var team = new Promise((resolve, reject) => {
    db.all(query, [teamId], (error, rows) => {
      if (error) {
        throw error;
      }
      console.log("result in model", rows);
      resolve(rows);
    });
  });
  return team;
};

const getTeamInfoWithEndDate = async (teamId, endDate) => {
  const query = `
      SELECT
      *
    FROM (
      SELECT
        uid,
        u.team_id,
        team_name
      FROM
        users u
      LEFT JOIN teams t
    WHERE
      u.team_id = t.team_id
      AND t.team_id = ?) AS t1
      JOIN (
        SELECT
          user_id, SUM(step_count) AS total_steps_accumulated
        FROM
          step_data
        WHERE
          record_date >= (SELECT DATE(?, '-7 day', 'weekday 0'))
            AND record_date < (SELECT(DATE(?,'+1 day')))
        GROUP BY
            user_id) AS t2 ON t1.uid = t2.user_id;
  `;
  var team = new Promise((resolve, reject) => {
    db.all(query, [teamId, endDate, endDate], (error, rows) => {
      if (error) {
        throw error;
      }
      resolve(rows);
    });
  });
  console.log("result in model", team);

  return team;
};

module.exports = {
  getAllTeams,
  getTeamInfoByTeamId,
  getTeamInfoWithEndDate,
  getAllTeamsStepDataWithEndDate,
};
