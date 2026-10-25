import assert from 'node:assert/strict';
import path from 'node:path';
import { chromium } from 'playwright';
import { buildTestUrl, maybeCaptureScreenshot, trackPageErrors } from './browser-test-helpers.mjs';
import { launchLocalChrome } from './local-chrome.mjs';
import { startStaticServer } from './static-server.mjs';

const rootDir = process.cwd();
const ownsServer = !process.env.INDEX_MENU_TEST_URL && !process.env.DEMOCODEX_BASE_URL;
const server = ownsServer ? await startStaticServer({ rootDir }) : null;
if (server) {
  process.env.DEMOCODEX_BASE_URL = server.url;
}
const testUrl = buildTestUrl({
  envName: 'INDEX_MENU_TEST_URL',
  pathname: '/index.html',
  query: '?q=%E6%8E%A8%E7%AE%B1&category=strategy&sort=quick&spotlight=storm-lock.html',
});

const captureEnabled = process.env.INDEX_MENU_CAPTURE === '1';
const screenshotDir = path.resolve(process.cwd(), 'output/index-menu-browser');

const { browser, executablePath } = await launchLocalChrome(chromium);
const page = await browser.newPage({
  viewport: { width: 1480, height: 1400 },
});
const errors = trackPageErrors(page);

await page.addInitScript(() => {
  window.__copiedText = null;

  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async (text) => {
        window.__copiedText = text;
      },
    },
  });
});

try {
  await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const grid = document.getElementById('games-grid');
    return grid && grid.getAttribute('aria-busy') === 'false' && grid.children.length > 0;
  });

  const initial = await page.evaluate(() => {
    const activeChip = document.querySelector('#menu-category-chips .menu-chip[aria-pressed="true"]');
    return {
      searchValue: document.getElementById('menu-search')?.value || '',
      sortValue: document.getElementById('menu-sort')?.value || '',
      activeCategory: activeChip?.textContent || '',
      resultsSummary: document.getElementById('menu-results-summary')?.textContent || '',
      spotlightTitle: document.getElementById('menu-spotlight-title')?.textContent || '',
      shareFeedback: document.getElementById('menu-share-feedback')?.textContent || '',
      locationSearch: window.location.search,
      visibleCards: document.querySelectorAll('#games-grid .menu-card').length,
    };
  });

  assert.equal(initial.searchValue, '推箱');
  assert.equal(initial.sortValue, 'quick');
  assert.match(initial.activeCategory, /策略谜局/);
  assert.match(initial.resultsSummary, /按短平快优先排序/);
  assert.match(initial.spotlightTitle, /风暴锁港/);
  assert.match(initial.shareFeedback, /已同步到地址栏/);
  assert.match(initial.locationSearch, /category=strategy/);
  assert.match(initial.locationSearch, /spotlight=storm-lock\.html/);
  assert(initial.visibleCards > 0, 'expected filtered index view to render cards');

  await page.click('#menu-share-view');
  await page.waitForFunction(() => Boolean(window.__copiedText));

  const copied = await page.evaluate(() => ({
    copiedText: window.__copiedText,
    shareFeedback: document.getElementById('menu-share-feedback')?.textContent || '',
  }));

  assert.match(copied.shareFeedback, /已复制/);
  assert.match(copied.copiedText, /index\.html\?q=%E6%8E%A8%E7%AE%B1&category=strategy&sort=quick&spotlight=storm-lock\.html/);

  await page.click('#menu-reset');
  await page.waitForFunction(() => {
    const search = document.getElementById('menu-search');
    const sort = document.getElementById('menu-sort');
    return window.location.search === '' && search && search.value === '' && sort && sort.value === 'recommended';
  });

  const afterReset = await page.evaluate(() => ({
    locationSearch: window.location.search,
    shareFeedback: document.getElementById('menu-share-feedback')?.textContent || '',
    spotlightTitle: document.getElementById('menu-spotlight-title')?.textContent || '',
    renderedCards: document.querySelectorAll('#games-grid .menu-card').length,
    totalCards: Number(document.getElementById('menu-total')?.textContent || 0),
    loadMoreHidden: document.getElementById('menu-load-more-wrap')?.hidden ?? true,
  }));

  assert.equal(afterReset.locationSearch, '');
  assert.match(afterReset.shareFeedback, /默认合集视图/);
  assert(afterReset.spotlightTitle.length > 0, 'expected default spotlight title after reset');
  assert(afterReset.totalCards > initial.visibleCards, 'expected reset to restore a broader shelf');
  assert(afterReset.renderedCards < afterReset.totalCards, 'expected default shelf to defer offscreen cards');
  assert.equal(afterReset.loadMoreHidden, false, 'expected load-more control when cards are deferred');

  await page.click('#menu-load-more');
  await page.waitForFunction(() => document.querySelectorAll('#games-grid .menu-card').length > 18);

  const afterLoadMore = await page.evaluate(() => ({
    renderedCards: document.querySelectorAll('#games-grid .menu-card').length,
    totalCards: Number(document.getElementById('menu-total')?.textContent || 0),
    loadMoreText: document.getElementById('menu-load-more')?.textContent || '',
  }));

  assert(afterLoadMore.renderedCards > afterReset.renderedCards, 'expected load-more to render another batch');
  assert(afterLoadMore.renderedCards <= afterLoadMore.totalCards);
  assert.match(afterLoadMore.loadMoreText, /继续展开|已经全部展开/);

  // Native keyboard activation must focus the newly rendered control, since
  // render() replaces category/card nodes rather than updating them in place.
  await page.getByRole('button', { name: /策略谜局/ }).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => {
    const active = document.activeElement;
    return active?.classList.contains('menu-chip')
      && active.getAttribute('aria-pressed') === 'true'
      && active.textContent.includes('策略谜局');
  }), true, 'Category activation must retain focus on the current category button');
  await page.click('#menu-reset');

  const favorite = page.locator('.menu-card__favorite').first();
  const favoriteTitle = await favorite.getAttribute('aria-label');
  await favorite.focus();
  await page.keyboard.press('Space');
  assert.equal(await page.evaluate(() => {
    const active = document.activeElement;
    return active?.classList.contains('menu-card__favorite')
      && active.getAttribute('aria-pressed') === 'true';
  }), true, 'Space must favorite once and focus its replacement button');
  assert.equal(await page.locator('.menu-card__favorite:focus').getAttribute('aria-label'), `取消${favoriteTitle}`);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.menu-card__favorite:focus').getAttribute('aria-pressed'), 'false');
  await page.keyboard.press('Space');
  await page.click('#menu-favorites-toggle');
  assert.equal(await page.locator('.menu-card__favorite').count(), 1);
  await page.locator('.menu-card__favorite').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.menu-card__favorite').count(), 0);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'menu-favorites-toggle');
  await page.locator('#menu-active-filters .menu-clear-filters').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'menu-search');
  await page.keyboard.type('推箱');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'menu-search');
  await page.keyboard.press('Escape');

  const screenshot = await maybeCaptureScreenshot(page, screenshotDir, 'index-menu.png', captureEnabled);
  assert.equal(errors.length, 0, `unexpected browser errors: ${JSON.stringify(errors)}`);

  console.log(
    JSON.stringify(
      {
        ok: true,
        url: testUrl,
        browser: executablePath,
        screenshot,
        initial,
        copied,
        afterReset,
        afterLoadMore,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  if (server) {
    await server.close();
  }
}
