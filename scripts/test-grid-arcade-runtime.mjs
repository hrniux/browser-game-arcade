import assert from 'node:assert/strict';
import core from '../src/js/grid-arcade-core.js';
import grove from '../src/js/glow-grove.js';
import orchid from '../src/js/orchid-guard.js';
import * as browserHelpers from './browser-test-helpers.mjs';

const config = {
  ...grove.CONFIG,
  mode: 'items',
  target: 1,
  pushBoxes: false,
  spreadHazards: false,
  scoreItem: 25,
  extraHazards: [],
  templates: [{ rows: ['#####', '#ScX#', '#...#', '#...#', '#####'] }],
};

function createHarness(storage = new Map()) {
  const nodes = new Map();
  const listeners = new Map();
  const originalGlobals = Object.fromEntries(
    ['window', 'document', 'localStorage'].map((name) => [
      name, Object.getOwnPropertyDescriptor(globalThis, name),
    ]),
  );
  const getNode = (id) => {
    if (!nodes.has(id)) {
      const handlers = new Map();
      const classes = new Set();
      const isButton = ['game-start', 'game-reset', 'game-wait-action', 'game-ability-action', 'game-restart'].includes(id);
      nodes.set(id, {
        id, textContent: '', innerHTML: '', width: 640, height: 640,
        tagName: isButton ? 'BUTTON' : id === 'body' ? 'BODY' : 'DIV',
        classList: {
          add: (name) => classes.add(name),
          remove: (name) => classes.delete(name),
          contains: (name) => classes.has(name),
        },
        addEventListener: (type, listener) => handlers.set(type, listener),
        closest(selectors) {
          return isButton && selectors.split(',').some((value) => value.trim() === 'button') ? this : null;
        },
        focus() { document.activeElement = this; },
        blur() { if (document.activeElement === this) document.activeElement = document.body; },
        click() { handlers.get('click')?.(); },
        getContext: () => ({ fillRect() {} }),
      });
    }
    return nodes.get(id);
  };
  const body = getNode('body');
  globalThis.document = { body, activeElement: body, getElementById: getNode, querySelector: getNode };
  globalThis.window = { addEventListener: (type, listener) => listeners.set(type, listener) };
  globalThis.localStorage = storage instanceof Map ? {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  } : storage;

  return {
    mount: (gameConfig = config) => core.mount(gameConfig, { fixedSeed: 42 }),
    nodes,
    press(code, { target = { closest: () => null }, defaultPrevented = false } = {}) {
      const event = {
        code, target, defaultPrevented, repeat: false,
        preventDefault() { this.defaultPrevented = true; },
      };
      listeners.get('keydown')(event);
      return event;
    },
    restore() {
      for (const [name, descriptor] of Object.entries(originalGlobals)) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else delete globalThis[name];
      }
    },
  };
}

function withGame(storage, check) {
  const harness = createHarness(storage);
  try {
    check(harness.mount(), harness);
  } finally {
    harness.restore();
  }
}

function matchingTarget(selector) {
  const ancestor = {};
  return {
    closest: (selectors) => selectors.split(',').some((value) => value.trim() === selector) ? ancestor : null,
  };
}

function checkNativeControls() {
  withGame(new Map(), (game, harness) => {
    game.startRun();
    for (const selector of ['button', 'a[href]', '[role="button"]']) {
      for (const code of ['Space', 'Enter']) {
        const before = game.renderGameToText();
        const event = harness.press(code, { target: matchingTarget(selector) });
        assert.equal(event.defaultPrevented, false, `${code} must preserve native ${selector} activation`);
        assert.equal(game.renderGameToText(), before, `${code} on ${selector} must not change game state`);
      }
    }
    for (const selector of ['input', 'select', 'textarea', '[contenteditable]:not([contenteditable="false"])']) {
      for (const code of ['Space', 'Enter', 'KeyR', 'ArrowRight', 'KeyQ']) {
        const before = game.renderGameToText();
        const event = harness.press(code, { target: matchingTarget(selector) });
        assert.equal(event.defaultPrevented, false, `${code} must preserve native ${selector} behavior`);
        assert.equal(game.renderGameToText(), before, `${code} in ${selector} must not change game state`);
      }
    }
    const beforeHandledEvent = game.renderGameToText();
    harness.press('Space', { defaultPrevented: true });
    assert.equal(game.renderGameToText(), beforeHandledEvent, 'handled events must not spend a turn');
  });
}

function checkGameShortcuts() {
  withGame(new Map(), (game, harness) => {
    assert.equal(harness.press('Enter').defaultPrevented, true);
    assert.equal(game.state.mode, 'active');
    assert.equal(harness.press('Space').defaultPrevented, true);
    assert.equal(game.state.turns, 1, 'game-surface Space should still wait');
    assert.equal(harness.press('ArrowRight').defaultPrevented, true);
    assert.deepEqual(game.state.player, { x: 2, y: 1 });
    assert.equal(game.state.score, 25);
    assert.equal(harness.press('KeyR').defaultPrevented, true);
    assert.equal(game.state.mode, 'idle');
    assert.equal(game.state.score, 0);
  });
}

function checkShortcutsAfterStartClick() {
  withGame(new Map(), (game, harness) => {
    game.startRun();
    // Mouse activation leaves the native Start button focused.
    const event = harness.press('ArrowRight', { target: matchingTarget('button') });
    assert.equal(event.defaultPrevented, true);
    assert.deepEqual(game.state.player, { x: 2, y: 1 }, 'movement must work after clicking Start');
    assert.equal(game.state.score, 25);
  });
}

function checkOrchidLossAfterControlFocus() {
  const harness = createHarness();
  try {
    const game = harness.mount(orchid.CONFIG);
    const start = harness.nodes.get('game-start');
    // A mouse Start click leaves the button focused, as the browser boot flow does.
    start.focus();
    start.click();
    const baseline = JSON.parse(game.renderGameToText());
    Object.assign(game.layout, {
      start: { x: 0, y: 0 }, exit: { x: 6, y: 6 },
      walls: new Set(), goals: [], goalKeys: new Set(),
    });
    Object.assign(game.state, {
      mode: 'active', floor: 1, player: { x: 2, y: 2 },
      boxes: [], hazards: [{ id: 0, x: 2, y: 1 }], items: [],
      progress: 0, turns: 0, score: 0, hull: 1, specialCooldown: 0,
      freezeTurns: 0, exitUnlocked: false, lastAbility: [],
    });
    const pressWithNativeActivation = (code) => {
      const target = document.activeElement;
      const event = harness.press(code, { target });
      // Model the native completed key activation only at the browser boundary.
      if (!event.defaultPrevented && ['Space', 'Enter'].includes(code) && target.tagName === 'BUTTON') target.click();
      return event;
    };

    assert.equal(pressWithNativeActivation('Space').defaultPrevented, false);
    assert.equal(game.state.mode, 'active', 'Space on focused Start preserves native activation');
    assert.equal(game.state.turns, 0, 'Native Start activation must not spend a gameplay turn');

    browserHelpers.releaseGameKeyboardFocus?.();
    const gameplaySpace = pressWithNativeActivation('Space');
    assert.equal(game.state.mode, 'gameover');
    assert.equal(gameplaySpace.defaultPrevented, true, 'Prepared gameplay Space must reach the game');
    assert.equal(game.state.hull, 0);
    assert.equal(game.state.turns, 1);
    assert.deepEqual(game.state.player, { x: 0, y: 0 });
    assert.equal(game.state.score, 0);
    assert.equal(document.activeElement, document.body, 'Gameplay setup must release the focused native control');
    assert.equal(harness.nodes.get('game-overlay').classList.contains('is-visible'), true);
    assert.equal(harness.nodes.get('game-overlay-title').textContent, '温室失守');

    assert.equal(pressWithNativeActivation('Enter').defaultPrevented, true);
    assert.deepEqual(JSON.parse(game.renderGameToText()), baseline, 'Enter on the game surface must recover the initial active run');
    assert.equal(harness.nodes.get('game-overlay').classList.contains('is-visible'), false);
    // The helper is also safe when body already owns focus.
    browserHelpers.releaseGameKeyboardFocus();
    assert.equal(document.activeElement, document.body);
  } finally {
    harness.restore();
  }
}

function createFailingStorage({ failRead = false, failWriteKey } = {}) {
  const values = new Map();
  return {
    getItem(key) {
      if (failRead) throw new DOMException('Storage access denied.', 'SecurityError');
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (key === failWriteKey) throw new DOMException('Storage quota exceeded.', 'QuotaExceededError');
      values.set(key, value);
    },
    removeItem: (key) => values.delete(key),
  };
}

function checkStorageReadFailure() {
  withGame(createFailingStorage({ failRead: true }), (game, harness) => {
    assert.equal(game.bestScore, 0);
    assert.equal(game.bestFloor, 0);
    assert.equal(harness.nodes.get('game-score').textContent, '0');
    game.startRun();
    game.handleAction('right');
    assert.equal(game.state.score, 25, 'storage denial must not block play after startup');
    assert.equal(harness.nodes.get('game-score').textContent, '25');
  });
}

function checkScoreWriteFailure() {
  withGame(createFailingStorage({ failWriteKey: config.storage.score }), (game, harness) => {
    game.startRun();
    assert.doesNotThrow(() => game.handleAction('right'), 'record failures must not escape a turn');
    assert.equal(game.state.turns, 1);
    assert.equal(game.bestScore, 25, 'session record should survive without persistence');
    assert.equal(harness.nodes.get('game-score').textContent, '25');
    assert.equal(harness.nodes.get('game-best').textContent, '25');
    game.handleAction('right');
    assert.equal(game.state.floor, 2, 'play should continue after the failed record write');
    assert.equal(game.bestFloor, 1);
  });
}

function checkFloorWriteFailure() {
  withGame(createFailingStorage({ failWriteKey: config.storage.floor }), (game, harness) => {
    game.startRun();
    game.handleAction('right');
    assert.doesNotThrow(() => game.handleAction('right'), 'floor record failure must not block extraction');
    assert.equal(game.state.floor, 2);
    assert.equal(game.bestFloor, 1);
    assert.equal(harness.nodes.get('game-floor').textContent, '2');
    assert.equal(harness.nodes.get('game-best-floor').textContent, '1');
    assert.equal(harness.nodes.get('game-score').textContent, '325');
  });
}

function checkHealthyStorage() {
  const storage = new Map([[config.storage.score, '100'], [config.storage.floor, '3']]);
  withGame(storage, (game, harness) => {
    assert.equal(harness.nodes.get('game-best').textContent, '100');
    assert.equal(harness.nodes.get('game-best-floor').textContent, '3');
    game.startRun();
    game.handleAction('right');
    game.handleAction('right');
    assert.equal(storage.get(config.storage.score), '325');
    assert.equal(storage.get(config.storage.floor), '3', 'existing higher floor record should be retained');
  });
}

const checks = {
  'native-controls': checkNativeControls,
  'game-shortcuts': checkGameShortcuts,
  'shortcuts-after-start-click': checkShortcutsAfterStartClick,
  'orchid-loss-after-control-focus': checkOrchidLossAfterControlFocus,
  'storage-read-failure': checkStorageReadFailure,
  'score-write-failure': checkScoreWriteFailure,
  'floor-write-failure': checkFloorWriteFailure,
  'healthy-storage': checkHealthyStorage,
};
const failures = [];
for (const [name, check] of Object.entries(checks)) {
  try {
    check();
  } catch (error) {
    failures.push({ name, message: error.message });
  }
}
assert.deepEqual(failures, [], 'runtime regressions must pass');
console.log(JSON.stringify({ ok: true, checks: Object.keys(checks) }));
