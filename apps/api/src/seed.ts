import sqlite3 from "sqlite3";

const db = new sqlite3.Database("ad_metrics.db");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS campaigns");

  db.run(`
    CREATE TABLE campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      platform TEXT,
      spend REAL,
      roas REAL,
      status TEXT
    )
  `);

  const stmt = db.prepare(
    "INSERT INTO campaigns (name, platform, spend, roas, status) VALUES (?, ?, ?, ?, ?)"
  );

  const data = [
    ["Summer_Sale", "Meta", 1200.5, 3.2, "Active"],
    ["Winter_Promo", "TikTok", 2500.0, 1.1, "Paused"],
    ["Influencer_Reach", "Meta", 500.0, 4.5, "Active"],
    ["Black_Friday", "TikTok", 5000.0, 2.8, "Scheduled"],
    ["Retargeting_Q1", "Meta", 800.0, 1.9, "Active"],
  ];

  data.forEach((row) => stmt.run(row));
  stmt.finalize();
});

db.close();
