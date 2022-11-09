"use strict";
const sqlite3 = require("sqlite3").verbose();
const { createDbConnection } = require("../../db");

let db = createDbConnection();

const getAllTeams = async () => {
  try {
    var results = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM teams`, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.teamName);
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

const getTeamInfoByTeamName = async (teamName) => {
  var team = new Promise((resolve, reject) => {
    db.all(
      `SELECT
      *
  FROM (
      SELECT
          user_id,
          username,
          u.team_id,
          team_name
      FROM
          users u
      LEFT JOIN teams t
  WHERE
      u.team_id = t.team_id
      AND t.team_name = ?) AS t1
      JOIN (
          SELECT
              user_id, SUM(step_count) AS total_step_last_7_days
          FROM
              step_data
          WHERE
              record_date >= (
                  SELECT
                      DATETIME ('now', '-7 day'))
              GROUP BY
                  user_id) AS t2 ON t1.user_id = t2.user_id;`,
      [teamName],
      (error, rows) => {
        if (error) {
          throw error;
        }
        console.log("result in model", rows);
        resolve(rows);
      }
    );
  });
  console.log("team in model", team);
  return team;
};

module.exports = { getAllTeams, getTeamInfoByTeamName };
