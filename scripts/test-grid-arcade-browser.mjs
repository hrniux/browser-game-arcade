import assert from 'node:assert/strict';
import path from 'node:path';
import { chromium } from 'playwright';
import {
  buildTestUrl,
  maybeCaptureScreenshot,
  readRenderState,
  releaseGameKeyboardFocus,
  trackPageErrors,
} from './browser-test-helpers.mjs';
import { launchLocalChrome } from './local-chrome.mjs';
import { startStaticServer } from './static-server.mjs';

function normalizeActors(items, defaults = {}) {
  return (items || []).map((item, index) => ({
    id: item.id ?? index,
    ...defaults,
    ...item,
  }));
}

async function applyScenario(page, { globalName, setup }) {
  await page.evaluate(
    ({ globalName: target, setup: scenario }) => {
      function normalizeActors(items, defaults = {}) {
        return (items || []).map((item, index) => ({
          id: item.id ?? index,
          ...defaults,
          ...item,
        }));
      }

      function buildTeleportMap(teleporters) {
        const grouped = new Map();
        const map = new Map();

        for (const teleporter of teleporters || []) {
          const key = teleporter.id ?? teleporter.channel ?? '1';
          if (!grouped.has(key)) {
            grouped.set(key, []);
          }
          grouped.get(key).push({ x: teleporter.x, y: teleporter.y });
        }

        for (const [key, cells] of grouped) {
          if (cells.length !== 2) {
            throw new Error(`Scenario teleporter ${key} must contain exactly two cells`);
          }
          map.set(`${cells[0].x}:${cells[0].y}`, { ...cells[1] });
          map.set(`${cells[1].x}:${cells[1].y}`, { ...cells[0] });
        }

        return map;
      }

      const game = window[target];
      if (!game) {
        throw new Error(`Game global not found: ${target}`);
      }

      const layout = game.layout;
      const state = game.state;

      if (scenario.layout) {
        if (scenario.layout.start) {
          layout.start = { ...scenario.layout.start };
        }
        if (scenario.layout.exit) {
          layout.exit = { ...scenario.layout.exit };
        }
        if (scenario.layout.walls) {
          layout.walls = new Set(scenario.layout.walls.map((cell) => `${cell.x}:${cell.y}`));
        }
        if (scenario.layout.goals) {
          layout.goals = scenario.layout.goals.map((goal, index) => ({ id: goal.id ?? index, ...goal }));
          layout.goalKeys = new Set(layout.goals.map((goal) => `${goal.x}:${goal.y}`));
        }
        if (scenario.layout.switches) {
          layout.switches = scenario.layout.switches.map((tile, index) => ({ id: tile.id ?? index, ...tile }));
          layout.switchKeys = new Set(layout.switches.map((tile) => `${tile.x}:${tile.y}`));
        }
        if (scenario.layout.gates) {
          layout.gates = scenario.layout.gates.map((tile, index) => ({ id: tile.id ?? index, ...tile }));
          layout.gateKeys = new Set(layout.gates.map((tile) => `${tile.x}:${tile.y}`));
        }
        if (scenario.layout.teleporters) {
          layout.teleporters = scenario.layout.teleporters.map((tile) => ({
            id: tile.id ?? tile.channel ?? '1',
            ...tile,
          }));
          layout.teleportMap = buildTeleportMap(layout.teleporters);
        }
      }

      if (scenario.state) {
        Object.assign(state, {
          mode: scenario.state.mode ?? state.mode,
          floor: scenario.state.floor ?? state.floor,
          hull: scenario.state.hull ?? state.hull,
          score: scenario.state.score ?? state.score,
          progress: scenario.state.progress ?? state.progress,
          turns: scenario.state.turns ?? state.turns,
          specialCooldown: scenario.state.specialCooldown ?? state.specialCooldown,
          freezeTurns: scenario.state.freezeTurns ?? state.freezeTurns,
          exitUnlocked: scenario.state.exitUnlocked ?? state.exitUnlocked,
          gatesOpen: scenario.state.gatesOpen ?? state.gatesOpen,
          player: scenario.state.player ? { ...scenario.state.player } : state.player,
          items: normalizeActors(scenario.state.items, { active: true }),
          hazards: normalizeActors(scenario.state.hazards),
          boxes: normalizeActors(scenario.state.boxes, { locked: false }),
          lastAbility: (scenario.state.lastAbility || []).map((cell) => ({ ...cell })),
        });
      }

      game.clearOverlay();
      if (scenario.status) {
        game.setStatus(scenario.status);
      }
      game.setObjective();
      game.updateHud();
      game.render();
    },
    { globalName, setup },
  );
}

async function readInternalSnapshot(page, globalName) {
  return page.evaluate((target) => {
    const game = window[target];
    return {
      freezeTurns: game.state.freezeTurns,
      overlayVisible: game.refs.overlay.classList.contains('is-visible'),
      overlayTitle: game.refs.overlayTitle.textContent,
    };
  }, globalName);
}

function assertSnapshotMatches(current, baseline) {
  assert.equal(current.floor, baseline.floor);
  assert.equal(current.score, baseline.score);
  assert.equal(current.hull, baseline.hull);
  assert.equal(current.progress, baseline.progress);
  assert.equal(current.turns, baseline.turns);
  assert.equal(current.specialCooldown, baseline.specialCooldown);
  assert.equal(current.gatesOpen, baseline.gatesOpen);
  assert.equal(current.exit.unlocked, baseline.exit.unlocked);
  assert.deepEqual(current.player, baseline.player);
  assert.deepEqual(current.items, baseline.items);
  assert.deepEqual(current.hazards, baseline.hazards);
  assert.deepEqual(current.boxes, baseline.boxes);
}

async function assertBootFlow(page, startSelector, globalName) {
  const idleState = await readRenderState(page);
  const idleInternal = await readInternalSnapshot(page, globalName);
  assert.equal(idleState.mode, 'idle');

  assert.equal(idleInternal.overlayVisible, true);

  await page.click(startSelector);
  await page.waitForTimeout(60);

  const activeState = await readRenderState(page);
  const activeInternal = await readInternalSnapshot(page, globalName);
  assert.equal(activeState.mode, 'active');
  assert.equal(activeInternal.overlayVisible, false);

  await page.keyboard.press('KeyR');
  await page.waitForTimeout(60);

  const resetState = await readRenderState(page);
  const resetInternal = await readInternalSnapshot(page, globalName);
  assert.equal(resetState.mode, 'idle');
  assertSnapshotMatches(resetState, idleState);
  assert.equal(resetInternal.freezeTurns, idleInternal.freezeTurns);
  assert.equal(resetInternal.overlayVisible, true);

  await page.click(startSelector);
  await page.waitForTimeout(60);

  const restartedState = await readRenderState(page);
  const restartedInternal = await readInternalSnapshot(page, globalName);
  assert.equal(restartedState.mode, 'active');
  assertSnapshotMatches(restartedState, activeState);
  assert.equal(restartedInternal.freezeTurns, activeInternal.freezeTurns);
  assert.equal(restartedInternal.overlayVisible, false);

  return {
    idleState,
    idleInternal,
    activeState,
    activeInternal,
  };
}

async function assertGameOverRecovery(page, baseline, globalName) {
  await page.keyboard.press('Enter');
  await page.waitForTimeout(60);

  const restartedState = await readRenderState(page);
  const restartedInternal = await readInternalSnapshot(page, globalName);
  assert.equal(restartedState.mode, 'active');
  assertSnapshotMatches(restartedState, baseline.activeState);
  assert.equal(restartedInternal.freezeTurns, baseline.activeInternal.freezeTurns);
  assert.equal(restartedInternal.overlayVisible, false);
}

function assertState(state, expected) {
  if (expected.mode !== undefined) {
    assert.equal(state.mode, expected.mode);
  }
  if (expected.player) {
    assert.deepEqual(state.player, expected.player);
  }
  if (expected.progress !== undefined) {
    assert.equal(state.progress, expected.progress);
  }
  if (expected.score !== undefined) {
    assert.equal(state.score, expected.score);
  }
  if (expected.hull !== undefined) {
    assert.equal(state.hull, expected.hull);
  }
  if (expected.specialCooldown !== undefined) {
    assert.equal(state.specialCooldown, expected.specialCooldown);
  }
  if (expected.floor !== undefined) {
    assert.equal(state.floor, expected.floor);
  }
  if (expected.gatesOpen !== undefined) {
    assert.equal(state.gatesOpen, expected.gatesOpen);
  }
  if (expected.exitUnlocked !== undefined) {
    assert.equal(state.exit.unlocked, expected.exitUnlocked);
  }
  if (expected.hazardsLength !== undefined) {
    assert.equal(state.hazards.length, expected.hazardsLength);
  }
  if (expected.itemsLength !== undefined) {
    assert.equal(state.items.length, expected.itemsLength);
  }
  if (expected.boxes) {
    assert.deepEqual(state.boxes, expected.boxes);
  }
}

async function assertInternal(page, globalName, expected) {
  if (!expected) {
    return;
  }

  const payload = await page.evaluate((target) => {
    const game = window[target];
    return {
      freezeTurns: game.state.freezeTurns,
      hazards: game.state.hazards.length,
      overlayVisible: game.refs.overlay.classList.contains('is-visible'),
      overlayOpacity: window.getComputedStyle(game.refs.overlay).opacity,
      overlayTitle: game.refs.overlayTitle.textContent,
    };
  }, globalName);

  if (expected.freezeTurns !== undefined) {
    assert.equal(payload.freezeTurns, expected.freezeTurns);
  }
  if (expected.hazards !== undefined) {
    assert.equal(payload.hazards, expected.hazards);
  }
  if (expected.overlayVisible !== undefined) {
    assert.equal(payload.overlayVisible, expected.overlayVisible);
  }
  if (expected.overlayOpacity !== undefined) {
    assert.equal(payload.overlayOpacity, expected.overlayOpacity);
  }
  if (expected.overlayTitle !== undefined) {
    assert.equal(payload.overlayTitle, expected.overlayTitle);
  }
}

async function waitForInternalVisualState(page, globalName, expected) {
  if (!expected || expected.overlayOpacity === undefined) {
    return;
  }

  await page.waitForFunction(
    ({ target, opacity }) => {
      const game = window[target];
      return window.getComputedStyle(game.refs.overlay).opacity === opacity;
    },
    { target: globalName, opacity: expected.overlayOpacity },
    { timeout: 3000 },
  );
}

export async function runGridArcadeBrowserTest(config) {
  const rootDir = process.cwd();
  const previousBaseUrl = process.env.DEMOCODEX_BASE_URL;
  const ownsServer = !process.env[config.envName] && !process.env.DEMOCODEX_BASE_URL;
  const server = ownsServer ? await startStaticServer({ rootDir }) : null;
  if (server) {
    process.env.DEMOCODEX_BASE_URL = server.url;
  }

  const testUrl = buildTestUrl({
    envName: config.envName,
    pathname: config.pathname,
    query: config.query || '?autotest=1&seed=4242',
  });
  const captureEnabled = process.env[config.captureEnv] === '1';
  const screenshotDir = path.resolve(process.cwd(), config.screenshotDir);
  let browser = null;

  try {
    const launched = await launchLocalChrome(chromium);
    browser = launched.browser;
    const executablePath = launched.executablePath;
    const page = await browser.newPage({
      viewport: config.viewport || { width: 1460, height: 1300 },
    });
    const errors = trackPageErrors(page);
    const results = {};

    for (const scenario of config.scenarios) {
      await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(320);
      const baseline = await assertBootFlow(page, '#game-start', config.globalName);
      await applyScenario(page, {
        globalName: config.globalName,
        setup: scenario.setup,
      });
      // Boot clicks leave Start focused; gameplay keys belong to the page surface.
      await page.evaluate(releaseGameKeyboardFocus);

      for (const key of scenario.actions || []) {
        await page.keyboard.press(key);
        await page.waitForTimeout(60);
      }

      const state = await readRenderState(page);
      assertState(state, scenario.expect);
      await waitForInternalVisualState(page, config.globalName, scenario.internalExpect);
      await assertInternal(page, config.globalName, scenario.internalExpect);
      if (scenario.postGameoverRestart) {
        await assertGameOverRecovery(page, baseline, config.globalName);
      }

      const screenshot = await maybeCaptureScreenshot(
        page,
        screenshotDir,
        scenario.screenshot,
        captureEnabled,
      );

      results[scenario.name] = {
        state,
        screenshot,
      };
    }

    assert.equal(errors.length, 0, `unexpected browser errors: ${JSON.stringify(errors)}`);

    return {
      ok: true,
      url: testUrl,
      browser: executablePath,
      screenshots: captureEnabled
        ? Object.fromEntries(
            Object.entries(results).map(([name, payload]) => [name, payload.screenshot]),
          )
        : null,
      scenarios: Object.fromEntries(
        Object.entries(results).map(([name, payload]) => [name, payload.state]),
      ),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      if (previousBaseUrl === undefined) {
        delete process.env.DEMOCODEX_BASE_URL;
      } else {
        process.env.DEMOCODEX_BASE_URL = previousBaseUrl;
      }
      await server.close();
    }
  }
}
