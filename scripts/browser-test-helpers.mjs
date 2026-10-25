import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_BASE_URL = 'http://127.0.0.1:4173';

export function buildTestUrl({ envName, pathname, query = '' }) {
  const directUrl = process.env[envName];
  if (directUrl) {
    return directUrl;
  }

  const baseUrl = process.env.DEMOCODEX_BASE_URL || DEFAULT_BASE_URL;
  return `${baseUrl}${pathname}${query}`;
}

export function trackPageErrors(page) {
  const errors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text: msg.text() });
    }
  });

  page.on('pageerror', (error) => {
    errors.push({ type: 'pageerror', text: String(error) });
  });

  return errors;
}

export async function maybeCaptureScreenshot(page, targetDir, name, enabled) {
  if (!enabled) {
    return null;
  }

  await fs.mkdir(targetDir, { recursive: true });
  const target = path.join(targetDir, name);
  await page.screenshot({ path: target, fullPage: true });
  return target;
}

export async function readRenderState(page) {
  return page.evaluate(() => {
    if (typeof window.render_game_to_text !== 'function') {
      throw new Error('window.render_game_to_text is not available');
    }
    return JSON.parse(window.render_game_to_text());
  });
}

// Run in the page before gameplay shortcuts, leaving native controls intact.
export function releaseGameKeyboardFocus() {
  document.activeElement?.blur?.();
}

export async function openStartedPage(page, { url, startSelector, delayMs = 300 }) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(delayMs);
  await page.click(startSelector);
}
