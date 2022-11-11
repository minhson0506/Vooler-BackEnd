const sqlite3 = require("sqlite3").verbose();
const { createDbConnection } = require("../db");

let db = createDbConnection();

const createNewUser = async (user) => {
  try {
    var results = new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (username, team_id) VALUES (?, ?);`,
        [user.username, user.team_id],
        function (err) {
          if (err) throw err;
          resolve({
            user_id: this.lastID,
            username: user.username,
          });
        }
      );
    });
    return results;
  } catch (e) {
    console.log(e);
  }
};

// TODO: check if we have this function
// const createNewTeam = async (team) => {};

const createNewRecord = async (record) => {
  try {
    var result = new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO step_data
                (user_id, step_count, record_date)
            VALUES (?, ?, ?)`,
        [record.user_id, record.step_count, record.record_date],
        function (err) {
          if (err) throw err;
          resolve({
            succesfully_saved: true,
            saved_timestamp: new Date(),
            record_id: this.lastID,
            user_id: record.user_id,
            record_date: record.record_date,
          });
        }
      );
    });
    return result;
  } catch (e) {
    return e;
  }
};

module.exports = {
  createNewUser,
  createNewRecord,
};
