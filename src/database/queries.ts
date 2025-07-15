import db from "./index.js";

export const createMonitor = db.prepare<{ test: string; name: string }>(`
  INSERT INTO monitors (test, name)
  VALUES (@test, @name)
  ON CONFLICT(name) DO UPDATE SET
    test = excluded.test
`);
