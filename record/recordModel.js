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
          reject(err);
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
            status: "created",
            saved_timestamp: new Date(),
            record_id: this.lastID,
            uid: uid,
            record_date: record.recordDate,
          });
        }
      );
    });
    return result;
  } catch (e) {
    return e;
  }
};

const updateRecord = async (uid, record) => {
  console.log(
    "update db",
    record.stepCount,
    record.recordDate,
    uid,
    record.recordDate
  );
  const query = `
    UPDATE
    step_data
    SET
      step_count = ?,
      record_date = ?
    WHERE
      user_id = ?
      AND(
      SELECT
        date(record_date)) = (
      SELECT
        date(?));`;
  var results = new Promise((resolve, reject) => {
    db.run(
      query,
      [record.stepCount, record.recordDate, uid, record.recordDate],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve({
          status: "updated",
          saved_timestamp: new Date(),
          uid: uid,
          record_date: record.recordDate,
        });
      }
    );
  });
  console.log("ret in model", results);
  return results;
};

module.exports = {
  createNewRecord,
  checkExistingEntryForDate,
  updateRecord,
};
