import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = '/tmp/inkwell.db';

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    const seedPath = path.join(process.cwd(), 'src', 'db', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf-8');
      _db.exec(seed);
    }
  }
  return _db;
}