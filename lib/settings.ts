import { db } from "./db";
import { CONFIG, LIMITS, Visibility } from "../config";

export interface Settings {
  dryRun: boolean;
  killSwitch: boolean;
  visibility: Visibility;
  dailyPublishLimit: number;
  minPublishIntervalMin: number;
  scrapeTopN: number;
  imageCandidates: number;
  cfImageSteps: number;
  showBrowser: boolean;
  claudeTimeoutSec: number;
  claudeConcurrency: number;
}

export function getSettings(): Settings {
  const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  const dbSettings = Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.value)]));

  return {
    dryRun: dbSettings.dryRun ?? CONFIG.dryRun,
    killSwitch: dbSettings.killSwitch ?? CONFIG.killSwitch,
    visibility: dbSettings.visibility ?? CONFIG.visibility,
    dailyPublishLimit: dbSettings.dailyPublishLimit ?? CONFIG.dailyPublishLimit,
    minPublishIntervalMin: dbSettings.minPublishIntervalMin ?? CONFIG.minPublishIntervalMin,
    scrapeTopN: dbSettings.scrapeTopN ?? CONFIG.scrapeTopN,
    imageCandidates: dbSettings.imageCandidates ?? CONFIG.imageCandidates,
    cfImageSteps: dbSettings.cfImageSteps ?? CONFIG.cfImageSteps,
    showBrowser: dbSettings.showBrowser ?? CONFIG.showBrowser,
    claudeTimeoutSec: dbSettings.claudeTimeoutSec ?? CONFIG.claudeTimeoutSec,
    claudeConcurrency: dbSettings.claudeConcurrency ?? CONFIG.claudeConcurrency,
  };
}

export function updateSettings(updates: Partial<Settings>) {
  const current = getSettings();
  const next = { ...current, ...updates };

  // Clamp values
  next.dailyPublishLimit = clamp(next.dailyPublishLimit, LIMITS.dailyPublishLimit);
  next.minPublishIntervalMin = clamp(next.minPublishIntervalMin, LIMITS.minPublishIntervalMin);
  next.scrapeTopN = clamp(next.scrapeTopN, LIMITS.scrapeTopN);
  next.imageCandidates = clamp(next.imageCandidates, LIMITS.imageCandidates);
  next.cfImageSteps = clamp(next.cfImageSteps, LIMITS.cfImageSteps);
  next.claudeTimeoutSec = clamp(next.claudeTimeoutSec, LIMITS.claudeTimeoutSec);
  next.claudeConcurrency = clamp(next.claudeConcurrency, LIMITS.claudeConcurrency);

  const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
  const transaction = db.transaction((obj: any) => {
    for (const [key, value] of Object.entries(obj)) {
      stmt.run(key, JSON.stringify(value));
    }
  });

  transaction(next);
}

export function resetSettings() {
  db.prepare("DELETE FROM settings").run();
}

function clamp(val: number, range: { min: number; max: number }) {
  return Math.max(range.min, Math.min(range.max, val));
}
