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
        password,
        team_id
      FROM users
      WHERE uid=? ;`,
      [uid],
      (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(rows);
      }
    );
  });
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
  return records;
};

const userIdExisted = async (userId) => {
  try {
    var results = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) {
          throw err;
        }
        resolve(rows);
      });
    });
    return results;
  } catch (e) {
    console.log(e);
  }
};

const getUserLogin = async (userId) => {
  try {
    var results = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) {
          throw err;
        }
        resolve(rows);
      });
    });
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

const getRecordsByUidWithEndDate = async (uid, endDate) => {
  const query = `
  SELECT
	uid,
	team_id,
	record_date,
	step_count_for_date,
	(SELECT
      (CASE WHEN strftime ('%w',?) IN ('0') 
      THEN
				(SELECT DATE(?))
			ELSE (SELECT DATE(?, '-7 day', 'weekday 0'))
		  END)) AS start_date,
		(
			SELECT DATE(?)) AS end_date
		FROM (
			SELECT * FROM users WHERE uid = ?) AS t1
	LEFT JOIN (
		SELECT
			user_id, sum(step_count) AS step_count_for_date, (
				SELECT
					date(record_date)) AS record_date
			FROM
				step_data
			WHERE
				user_id = ?
				AND record_date >= (
					SELECT
						(CASE WHEN strftime ('%w', ?) in('0') 
              THEN (SELECT DATE(?))
							ELSE (SELECT DATE(?, '-7 day', 'weekday 0'))
							END)
          )
					AND record_date < (SELECT (DATE(?, '+1 day')))
      GROUP BY 
        user_id,
        record_date) AS t2 
    ON t1.uid = t2.user_id;
  `;
  var results = new Promise((resolve, reject) => {
    db.all(
      query,
      [
        endDate,
        endDate,
        endDate,
        endDate,
        uid,
        uid,
        endDate,
        endDate,
        endDate,
        endDate,
      ],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
  return results;
};

const updateUserInfo = (user, uid) => {
  const query = `UPDATE users
    SET user_id=?, password=?, team_id=?
    WHERE uid=?;
    `;
  var results = new Promise((resolve, reject) => {
    db.run(
      query,
      [user.userId, user.password, user.teamId, uid],
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
  userIdExisted,
  getUserLogin,
  createNewUser,
  getRecordsByUidWithEndDate,
  updateUserInfo,
};
