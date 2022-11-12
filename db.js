const sqlite3 = require("sqlite3").verbose();
const filepath = "./vooler.db";
const fs = require("fs");

const createDbConnection = () => {
  if (fs.existsSync(filepath)) {
    return new sqlite3.Database(filepath);
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
      createTable(db);
    });
    console.log("Connection with SQLite has been established");
    return db;
  }
};

const createTable = (newdb) => {
  newdb.exec(
    `
    CREATE TABLE teams
    (
        team_id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_name VARCHAR(50) NOT NULL,
        descriptions VARCHAR(255) NULL
    );
    CREATE TABLE users (
        user_id TEXT UNIQUE PRIMARY KEY,
        password TEXT NOT NULL,
        team_id INTEGER NULL,
        FOREIGN KEY (team_id)
            REFERENCES teams(team_id)
    );
    CREATE TABLE step_data
    (
        record_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        step_count INTEGER NOT NULL,
        record_date DATE NOT NULL,
        init_data_in_date INTEGER NULL,
        FOREIGN KEY (user_id)
            REFERENCES users(user_id)
    );

    INSERT INTO teams
        (team_name)
    VALUES
        ('Team1'),
        ('Team2');

    INSERT INTO users
        (user_id, password, team_id)
    VALUES
        ("Joe", "1234" , 1),
        ("Jane", "1234" ,1),
        ("Doe", "1234", null);

    INSERT INTO step_data
        (user_id, step_count, record_date)
    VALUES
        ("Joe", 500, '2022-11-07 23:59:59'),
        ("Joe", 1234, '2022-11-08 23:59:59'),
        ("Jane", 500, '2022-11-08 23:59:59');
    `
  );
};

module.exports = { createDbConnection };
