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

const teamInfoQuery = (dateCondition, stepColumnName) => {
  const sqlString = `SELECT
      *
    FROM (
      SELECT
        u.user_id,
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
            user_id) AS t2 ON t1.user_id = t2.step_userId;`;
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

const getTeamInfoWithStartDate = async (teamId, startDate) => {
  const query = teamInfoQuery("?", "total_step_from_startDate");
  var team = new Promise((resolve, reject) => {
    db.all(query, [teamId, startDate], (error, rows) => {
      if (error) {
        throw error;
      }
      resolve(rows);
    });
  });
  console.log("result in model", team);

  return team;
};

module.exports = { getAllTeams, getTeamInfoByTeamId, getTeamInfoWithStartDate };
