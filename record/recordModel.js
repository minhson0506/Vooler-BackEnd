const sqlite3 = require("sqlite3").verbose();
const { createDbConnection } = require("../db");

let db = createDbConnection();

const checkExistingEntryForDate = async (date, uid) => {
  const query = `
  SELECT * FROM step_data
  WHERE (
    SELECT
      date(record_date)) = (
      SELECT
        date(?))
      AND user_id = ?;`;
  try {
    var results = new Promise((resolve, reject) => {
      db.all(query, [date, uid], (err, rows) => {
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

const createNewRecord = async (uid, record) => {
  try {
    var result = new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO step_data
                (user_id, step_count, record_date)
            VALUES (?, ?, ?)`,
        [uid, record.stepCount, record.recordDate],
        function (err) {
          if (err) reject(err);
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
  checkExistingEntryForDate,
};
