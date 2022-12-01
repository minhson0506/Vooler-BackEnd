const sqlite3 = require("sqlite3").verbose();
const filepath = "./vooler.db";
const fs = require("fs");
const { seedData } = require("./seedDb");

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
      seedData(db);
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
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE,
        password TEXT NOT NULL,
        team_id INTEGER NULL,
        CONSTRAINT fk_user_team
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
        CONSTRAINT fk_step_user
        FOREIGN KEY (user_id)
            REFERENCES users(uid)
    );
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
