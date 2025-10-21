-- Votes: هر کلیک یک رکورد؛ «آخرین رأی هر کاربر» ملاک شمارش
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  userId TEXT NOT NULL,
  option TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_votes_user_ts ON votes(userId, ts DESC);

-- Options: لیست گزینه‌ها (اسم یکتا)
CREATE TABLE IF NOT EXISTS options (
  option TEXT PRIMARY KEY,
  description TEXT DEFAULT ''
);

