import db from "./index.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS monitors (
    name TEXT NOT NULL PRIMARY KEY,
    test TEXT NOT NULL
  );
  `);
