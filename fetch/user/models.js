const sqlite3 = require("sqlite3").verbose();
const { createDbConnection } = require("../../db");

let db = createDbConnection();

const getAllUsers = async () => {
  try {
    var results = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.username);
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

const getUserByUsername = async (username) => {
  var user = new Promise((resolve, reject) => {
    db.get(
      `SELECT
      t1.user_id, username, team_id, total_step_last_7_days
    FROM (
      SELECT
        *
      FROM
        users
      WHERE
        username = ?) AS t1
      LEFT JOIN (
        SELECT
          user_id, sum(step_count) as total_step_last_7_days
        FROM
          step_data
        WHERE
          record_date >= (
            SELECT
              DATETIME ('now', '-7 day'))
          ORDER BY
            user_id) AS t2 ON t1.user_id = t2.user_id;`,
      [username],
      (error, row) => {
        if (error) {
          throw error;
        }
        console.log("result in model", row);
        resolve(row);
      }
    );
  });
  console.log("user in model", user);
  return user;
};

const getAllRecordsByUserName = async (username) => {
  var records = new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM
        step_data
      WHERE
        step_data.user_id = (
          SELECT user_id FROM users
          WHERE username = ?
          LIMIT 1);`,
      [username],
      (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.username);
        });
        resolve(rows);
      }
    );
  });
  console.log("records in model", records);
  return records;
};

const getTotalStepsLastSevenDays = async (username) => {
  var totalSteps = new Promise((resolve, reject) => {
    db.get(
      `SELECT user_id, SUM(step_count) as total_step 
      FROM step_data
      WHERE
        record_date >= (SELECT DATETIME ('now', '-7 day'))
      AND user_id =  (
        SELECT user_id FROM users
        WHERE username = ?
        LIMIT 1
        );`,
      [username],
      (err, rows) => {
        if (err) {
          throw err;
        }
        console.log("result in model", rows);
        resolve(rows);
      }
    );
  });
  console.log("total step", totalSteps);
  return totalSteps;
};

const usernameExisted = async (userName) => {
  try {
    var results = new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM users WHERE username = ?`,
        [userName],
        (err, rows) => {
          if (err) {
            throw err;
          }
          rows.forEach((row) => {
            console.log(row.username);
          });
          resolve(rows);
        }
      );
    });
    console.log("ret in model", results);
    return results;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getUserByUsername,
  getAllUsers,
  getAllRecordsByUserName,
  getTotalStepsLastSevenDays,
  usernameExisted,
};
