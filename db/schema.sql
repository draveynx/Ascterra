CREATE TABLE IF NOT EXISTS konten (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'tiktok',
  status TEXT NOT NULL DEFAULT 'ide',
  tanggal_tayang TEXT,
  catatan TEXT,
  dibuat_pada TEXT NOT NULL DEFAULT (datetime('now'))
);
