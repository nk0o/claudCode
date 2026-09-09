import path from "path";
import fs from "fs";

export const rootDir = process.cwd();
export const dataDir = path.resolve(rootDir, "data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const sessionPath = path.join(dataDir, "naver-session.json");
export const dbPath = path.join(dataDir, "blog.sqlite");
export const imagesDir = path.join(dataDir, "images");
export const screenshotsDir = path.join(dataDir, "screenshots");

[imagesDir, screenshotsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Normalize path for NFC (to handle macOS NFD/NFC issue)
 * Also handles case sensitivity for Windows.
 */
export function normalizePath(p: string): string {
  const n = path.resolve(p).normalize("NFC");
  return process.platform === "win32" ? n.toLowerCase() : n;
}

export function isInsideData(p: string): boolean {
  const normP = normalizePath(p);
  const normData = normalizePath(dataDir);
  return normP.startsWith(normData);
}
