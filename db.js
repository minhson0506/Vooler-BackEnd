const sqlite3 = require("sqlite3").verbose();
const filepath = "./vooler.db";
const fs = require("fs");

const createDbConnection = () => {
  if (fs.existsSync(filepath)) {
    let db = new sqlite3.Database(filepath);
    activateForeignKeys(db);
    return db;
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
    PRAGMA foreign_keys = ON;
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
        CONSTRAINT fk_user_team
        FOREIGN KEY (team_id)
            REFERENCES teams(team_id)
    );
    CREATE TABLE step_data
    (
        record_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        step_count INTEGER NOT NULL,
        record_date DATE NOT NULL,
        init_data_in_date INTEGER NULL,
        CONSTRAINT fk_step_user
        FOREIGN KEY (user_id)
            REFERENCES users(user_id)
    );

    INSERT INTO teams
        (team_name)
    VALUES
        ('Hoiva Mehiläinen'),
        ('Koti ja Tähti');

    INSERT INTO users
        (user_id, password, team_id)
    VALUES
        ("Joe", "1234" , 1),
        ("Jane", "1234" ,1),
        ("Doe", "1234", null);

    INSERT INTO step_data
        (user_id, step_count, record_date)
    VALUES
        ("Joe", 500, '2022-11-17 23:59:59'),
        ("Joe", 1234, '2022-11-18 23:59:59'),
        ("Jane", 500, '2022-11-18 23:59:59');
    `
  );
};

const activateForeignKeys = (db) => {
  db.exec(
    `
    PRAGMA foreign_keys = ON;
    `
  );
};

module.exports = { createDbConnection };
