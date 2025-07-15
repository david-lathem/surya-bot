import db from "./index.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS sticky_messages (
    channelId TEXT PRIMARY KEY,
    content TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS ticket_tracker (
    channelId TEXT NOT NULL PRIMARY KEY,
    userId TEXT
  );
`);
