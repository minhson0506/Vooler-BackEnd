const sqlite3 = require("sqlite3").verbose();
const { createDbConnection } = require("../db");

let db = createDbConnection();

const getAllUsers = async () => {
  try {
    var results = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
          throw err;
        }
        resolve(rows);
      });
    });
    console.log("ret in model", results);
    return results;
  } catch (e) {
    console.log(e);
  }
};

const getUserByUserId = async (userId) => {
  var user = new Promise((resolve, reject) => {
    db.get(
      `SELECT
      t1.user_id, team_id, total_step_last_7_days
    FROM (
      SELECT
        *
      FROM
        users
      WHERE
        user_id = ?) AS t1
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
      [userId],
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

const getAllRecordsByUserId = async (userId) => {
  var records = new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM
        step_data
      WHERE
        step_data.user_id = (
          SELECT user_id FROM users
          WHERE user_id = ?
          LIMIT 1);`,
      [userId],
      (err, rows) => {
        if (err) {
          throw err;
        }
        // rows.forEach((row) => {
        //   console.log(row.userId);
        // });
        resolve(rows);
      }
    );
  });
  console.log("records in model", records);
  return records;
};

const getTotalStepsLastSevenDays = async (userId) => {
  var totalSteps = new Promise((resolve, reject) => {
    db.get(
      `SELECT user_id, SUM(step_count) as total_step 
      FROM step_data
      WHERE
        record_date >= (SELECT DATETIME ('now', '-7 day'))
      AND user_id =  (
        SELECT user_id FROM users
        WHERE user_id = ?
        LIMIT 1
        );`,
      [userId],
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

const userIdExisted = async (userId) => {
  try {
    var results = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.user_id);
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

const getUserLogin = async (userId) => {
  try {
    console.log(userId);
    var results = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.user_id);
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

const createNewUser = async (user) => {
  var results = new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (user_id, password, team_id) VALUES (?, ?, ?);`,
      [user.user_id, user.password, user.team_id],
      function (err) {
        if (err) reject(err);
        resolve({
          row_added: this.lastID,
          user_id: user.user_id,
        });
      }
    );
  });
  return results;
};

const getRecordsByUserIdAndStartDate = async (userId, startDate) => {
  var results = new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM step_data s
      WHERE user_id = ?
      AND s.record_date >= ?;`,
      [userId, startDate],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
  return results;
};

const updateTeamIdForUserId = async (userId, teamdId) => {
  var results = new Promise((resolve, reject) => {
    db.run(
      `UPDATE users
      SET team_id= ?
      WHERE user_id= ?;`,
      [teamdId, userId],
      function (err, row) {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
  return results;
};

module.exports = {
  getUserByUserId,
  getAllUsers,
  getAllRecordsByUserId,
  getTotalStepsLastSevenDays,
  userIdExisted,
  getUserLogin,
  createNewUser,
  getRecordsByUserIdAndStartDate,
  updateTeamIdForUserId,
};
