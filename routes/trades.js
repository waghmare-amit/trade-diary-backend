const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./db/trade-diary.db', (err) => {
  if (err) throw err;
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS trades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  instrument TEXT,
  direction TEXT,
  quantity INTEGER,
  profit_loss REAL,
  strategy TEXT,
  entry_reason TEXT,
  analysis TEXT,
  analysis_correct BOOLEAN,
  missed_opportunities TEXT,
  notes TEXT,
  emotion TEXT,
  tags TEXT,
  screenshot TEXT
)`);

// Get all trades
router.get('/', (req, res) => {
  db.all('SELECT * FROM trades ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Add a trade
router.post('/', (req, res) => {
  const t = req.body;
  db.run(
    `INSERT INTO trades
      (date, instrument, direction, quantity, profit_loss, strategy, entry_reason, analysis, analysis_correct, missed_opportunities, notes, emotion, tags, screenshot)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      t.date, t.instrument, t.direction, t.quantity, t.profit_loss, t.strategy,
      t.entry_reason, t.analysis, t.analysis_correct,
      t.missed_opportunities, t.notes, t.emotion, t.tags, t.screenshot
    ],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
