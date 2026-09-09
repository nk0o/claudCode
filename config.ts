export const CONFIG = {
  dryRun: true,
  killSwitch: false,
  visibility: "private", // Default must be private
  dailyPublishLimit: 3,
  minPublishIntervalMin: 30,
  scrapeTopN: 8,
  imageCandidates: 10,
  cfImageSteps: 6,
  showBrowser: false,
  claudeTimeoutSec: 180,
  claudeConcurrency: 2,
} as const;

export type Visibility = "public" | "neighbor" | "both" | "private";

export const LIMITS = {
  dailyPublishLimit: { min: 1, max: 50 },
  minPublishIntervalMin: { min: 0, max: 720 },
  scrapeTopN: { min: 3, max: 30 },
  imageCandidates: { min: 3, max: 20 },
  cfImageSteps: { min: 1, max: 8 },
  claudeTimeoutSec: { min: 30, max: 900 },
  claudeConcurrency: { min: 1, max: 6 },
};
