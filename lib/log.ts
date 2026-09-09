import { db } from "./db";

export type LogLevel = "info" | "warn" | "error" | "success";

export function jobLog(jobId: string, level: LogLevel, message: string) {
  const stmt = db.prepare("INSERT INTO job_logs (job_id, level, message) VALUES (?, ?, ?)");
  stmt.run(jobId, level, message);
  console.log(`[${level.toUpperCase()}] [${jobId}] ${message}`);
}

export function getJobLogs(jobId: string, lastId: number = 0) {
  return db.prepare("SELECT * FROM job_logs WHERE job_id = ? AND id > ? ORDER BY id ASC")
    .all(jobId, lastId);
}
