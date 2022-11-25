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

const getUserByUserId = async (uid) => {
  var user = new Promise((resolve, reject) => {
    db.get(
      `SELECT
        uid,
        user_id,
        team_id
      FROM users
      WHERE uid=? ;`,
      [uid],
      (error, rows) => {
        if (error) {
          reject(error);
        }
        console.log("result in model", rows);
        resolve(rows);
      }
    );
  });
  console.log("user in model", user);
  return user;
};

const getAllRecordsByUserId = async (uid) => {
  var records = new Promise((resolve, reject) => {
    db.all(
      `SELECT
        uid,
        team_id,
        record_date,
        step_count_for_date
      FROM (
        SELECT
          *
        FROM
          users
        WHERE
          uid = ?) AS t1
        LEFT JOIN (
          SELECT
            user_id, sum(step_count) AS step_count_for_date, (
              SELECT
                date(record_date)) AS record_date
            FROM
              step_data
            WHERE
              user_id = ?
            GROUP BY
              user_id,
              record_date) AS t2 
        ON t1.uid = t2.user_id;`,
      [uid, uid],
      (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      }
    );
  });
  console.log("records in model", records);
  return records;
};

// const getTotalStepsLastSevenDays = async (uid) => {
//   var totalSteps = new Promise((resolve, reject) => {
//     db.get(
//       `SELECT user_id, SUM(step_count) as total_step
//       FROM step_data
//       WHERE
//         record_date >= (SELECT DATETIME ('now', '-7 day'))
//       AND user_id =  (
//         SELECT uid FROM users
//         WHERE uid = ?
//         LIMIT 1
//         );`,
//       [uid],
//       (err, rows) => {
//         if (err) {
//           throw err;
//         }
//         console.log("result in model", rows);
//         resolve(rows);
//       }
//     );
//   });
//   console.log("total step", totalSteps);
//   return totalSteps;
// };

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
          uid: this.lastID,
          user_id: user.user_id,
        });
      }
    );
  });
  return results;
};

const getRecordsByUidAndStartDate = async (uid, startDate) => {
  var results = new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM step_data s
      WHERE user_id = ?
      AND s.record_date >= ?;`,
      [uid, startDate],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
  return results;
};

const updateTeamIdForUid = async (uid, teamId) => {
  var results = new Promise((resolve, reject) => {
    db.run(
      `UPDATE users
      SET team_id= ?
      WHERE uid= ?;`,
      [teamId, uid],
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
  // getTotalStepsLastSevenDays,
  userIdExisted,
  getUserLogin,
  createNewUser,
  getRecordsByUidAndStartDate,
  updateTeamIdForUid,
};
