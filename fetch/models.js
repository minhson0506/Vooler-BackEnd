const pool = require("../db");

const getUserByUsername = (username) => {
  pool.query(
    "SELECT * FROM users WHERE id = $1",
    [username],
    (error, results) => {
      if (error) {
        throw error;
      }
      return json(results.rows);
    }
  );
};

module.exports = { getUserByUsername };
