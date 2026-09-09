import Database from "better-sqlite3";
import { dbPath } from "./paths";

declare global {
  var __blogDb: Database.Database | undefined;
}

function initDb() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      keyword TEXT,
      status TEXT,
      stage TEXT,
      auto INTEGER,
      mode TEXT,
      inputs TEXT,
      error TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      type TEXT,
      title TEXT,
      summary TEXT,
      url TEXT,
      content TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(job_id) REFERENCES jobs(id)
    );

    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      title TEXT,
      angle TEXT,
      rationale TEXT,
      chosen INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(job_id) REFERENCES jobs(id)
    );

    CREATE TABLE IF NOT EXISTS drafts (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      idea_id TEXT,
      title TEXT,
      body_json TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(job_id) REFERENCES jobs(id),
      FOREIGN KEY(idea_id) REFERENCES ideas(id)
    );

    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      draft_id TEXT,
      query TEXT,
      src_url TEXT,
      local_path TEXT,
      source_site TEXT,
      verdict_ok INTEGER,
      verdict_reason TEXT,
      section_index INTEGER,
      gen_prompt TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(job_id) REFERENCES jobs(id),
      FOREIGN KEY(draft_id) REFERENCES drafts(id)
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      draft_id TEXT,
      status TEXT,
      blog_url TEXT,
      screenshot TEXT,
      note TEXT,
      published_at DATETIME,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(job_id) REFERENCES jobs(id),
      FOREIGN KEY(draft_id) REFERENCES drafts(id)
    );

    CREATE TABLE IF NOT EXISTS job_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id TEXT,
      level TEXT,
      message TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(job_id) REFERENCES jobs(id)
    );
  `);

  return db;
}

export const db = globalThis.__blogDb || (globalThis.__blogDb = initDb());
