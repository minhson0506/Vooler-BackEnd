const sqlite3 = require("sqlite3").verbose();
const { createDbConnection } = require("../db");

let db = createDbConnection();

// TODO: check if we need the function to create new team
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
  createNewRecord,
};
