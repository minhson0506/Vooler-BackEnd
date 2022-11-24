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
        ('Team 1'),
        ('Team 2'),
        ('Team 3'),
        ('Team 4'),
        ('Team 5'),
        ('Team 6');

    INSERT INTO users
        (user_id, password, team_id)
    VALUES
        ("Joe", "1234" , 1),
        ("Jane", "1234" ,1),
        ("Doe", "1234", null),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9u8ZrrbW5hMO01sm2ePJuVOB0rQExW03u","$2a$12$3TNWLZkSAp1FgvpfGJOg9uQE2h20oMttxamVKCTS2iM0GX8.unD7m",4),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9u3kaVruVTCBxWg.9KW5YYZwYVvJvZ2n6","$2a$12$3TNWLZkSAp1FgvpfGJOg9u/mkg9zBJ6hVpKKfAdc2qKfRhix3P/Mq",1),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uo9voWMQbL.E.3XXZX/2ocNePqlsR3uO","$2a$12$3TNWLZkSAp1FgvpfGJOg9uPRc9SNv74Ez4j3ydCClBUV7GlOrlMvO",1),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uWDR6BBOEKCV1zxSQ8J7Ld9Vy27SITp6","$2a$12$3TNWLZkSAp1FgvpfGJOg9uYadkCN81QPOoeWdR542lPxA/cwHfR8e",1),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9u67icCG4yG9gs9F6LFuKNvUgkFC6Bgwm","$2a$12$3TNWLZkSAp1FgvpfGJOg9uoRxY0cxdF7OYSWvDNyGlGgqNm3PFXm2",2),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9urxFo8Sbhofeu58D3oHJw2Z9cGUKOlbq","$2a$12$3TNWLZkSAp1FgvpfGJOg9uWj6Fw8ava9Muxf.RnYb/B7BrT2jaI5O",2),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uzpl8jKqiBj0bD9hWo4XqAywX2/95f0K","$2a$12$3TNWLZkSAp1FgvpfGJOg9uFkNcpfIZZnkEsuYvG2uRQKAGvDxYfz.",2),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9u3yp9i67IBUJWCIJjK2YnxV.FYI0tU3W","$2a$12$3TNWLZkSAp1FgvpfGJOg9u/yGYdwp8S6zzsFrMT2K191UX1N2bBWu",3),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uCunsYv2PAWAuWIIHcUJcBhxdUQb3O7O","$2a$12$3TNWLZkSAp1FgvpfGJOg9ub6iUW/IJSXZFTROnrdMMNwoYJ/ORc8i",3),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uol4ZqdOl5HEDp4TFpbhPWoZZmB92QtK","$2a$12$3TNWLZkSAp1FgvpfGJOg9uZJ2BEZ/iEv.Mg80.7JpycgRjc3CVX/u",3),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uaPQwABQxLwS64ieD7ojYXKmAihVhR2O","$2a$12$3TNWLZkSAp1FgvpfGJOg9u7.1NcJMb.2IavPv01zXpjy/KwA.1M6a",4),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uryuwvIw..ZjdaJdYuCBpEr8yrecf8y6","$2a$12$3TNWLZkSAp1FgvpfGJOg9unVnVFNi6HUPZopr1pkjsAnnpvDoYfB.",4),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uKc0W24G6epVz5nwWCNgu9geOk/mzTIe","$2a$12$3TNWLZkSAp1FgvpfGJOg9uXm95snhDnA.uS93/6gUlV7DzvzN/PtG",5),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9ub/5hs1D8V9EHJmUnEwGUlWX5mflzQJe","$2a$12$3TNWLZkSAp1FgvpfGJOg9ueCTQZXH8wsuZvrzT1P6jFnucC8be2ee",5),
("$2a$12$3TNWLZkSAp1FgvpfGJOg9uE7/zrqK/kW3teUhgR7LhoLIHziKlXYW","$2a$12$3TNWLZkSAp1FgvpfGJOg9udxq3pukw51ikZLd0jcmYTV3/aN97hpm",5);


    INSERT INTO step_data
        (user_id, step_count, record_date)
    VALUES
        ("Joe", 500, '2022-11-17 23:59:59'),
        ("Joe", 1234, '2022-11-18 23:59:59'),
        ("Jane", 500, '2022-11-18 23:59:59'),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9u8ZrrbW5hMO01sm2ePJuVOB0rQExW03u",201,"2022-11-23 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9u3kaVruVTCBxWg.9KW5YYZwYVvJvZ2n6",250,"2022-11-23 21:33:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uo9voWMQbL.E.3XXZX/2ocNePqlsR3uO",300,"2022-11-22 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uWDR6BBOEKCV1zxSQ8J7Ld9Vy27SITp6",320,"2022-11-21 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9u67icCG4yG9gs9F6LFuKNvUgkFC6Bgwm",350,"2022-11-20 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9urxFo8Sbhofeu58D3oHJw2Z9cGUKOlbq",378,"2022-11-21 20:30:43"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uzpl8jKqiBj0bD9hWo4XqAywX2/95f0K",400,"2022-11-23 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9u3yp9i67IBUJWCIJjK2YnxV.FYI0tU3W",401,"2022-11-22 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uCunsYv2PAWAuWIIHcUJcBhxdUQb3O7O",480,"2022-11-21 20:30:43"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uol4ZqdOl5HEDp4TFpbhPWoZZmB92QtK",590,"2022-11-20 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uaPQwABQxLwS64ieD7ojYXKmAihVhR2O",354,"2022-11-23 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uryuwvIw..ZjdaJdYuCBpEr8yrecf8y6",125,"2022-11-22 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uKc0W24G6epVz5nwWCNgu9geOk/mzTIe",248,"2022-11-21 21:32:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9ub/5hs1D8V9EHJmUnEwGUlWX5mflzQJe",453,"2022-11-20 21:20:59"),
        ("$2a$12$3TNWLZkSAp1FgvpfGJOg9uE7/zrqK/kW3teUhgR7LhoLIHziKlXYW",358,"2022-11-21 20:30:43");
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
