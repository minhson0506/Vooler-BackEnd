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

const createNewTeam = async (team) => {};

const createNewRecord = async (record) => {};

module.exports = {
  createNewUser,
  createNewRecord,
};
