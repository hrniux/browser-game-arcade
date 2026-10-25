(function () {
  const MOVE_KEYS = new Map([
    ['ArrowUp', 'up'],
    ['KeyW', 'up'],
    ['ArrowDown', 'down'],
    ['KeyS', 'down'],
    ['ArrowLeft', 'left'],
    ['KeyA', 'left'],
    ['ArrowRight', 'right'],
    ['KeyD', 'right'],
  ]);

  const WAIT_KEYS = new Set(['Space', 'KeyX', 'Period']);
  const ABILITY_KEYS = new Set(['KeyQ']);

  const STEP_DELTAS = [
    { name: 'up', x: 0, y: -1 },
    { name: 'left', x: -1, y: 0 },
    { name: 'right', x: 1, y: 0 },
    { name: 'down', x: 0, y: 1 },
  ];

  function parseSeedValue(value) {
    if (value === null || value === '') {
      return null;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed >>> 0 : null;
  }

  function createSeedBase() {
    return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  }

  function inBounds(cell, size) {
    return cell.x >= 0 && cell.x < size && cell.y >= 0 && cell.y < size;
  }

  function cellKey(cell) {
    return `${cell.x}:${cell.y}`;
  }

  function sameCell(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function cloneCell(cell) {
    return { x: cell.x, y: cell.y };
  }

  function cloneActors(items) {
    return items.map((item) => ({ ...item }));
  }

  function cloneState(state) {
    return {
      ...state,
      player: cloneCell(state.player),
      items: cloneActors(state.items),
      hazards: cloneActors(state.hazards),
      boxes: cloneActors(state.boxes),
      lastAbility: state.lastAbility.map((item) => ({ ...item })),
      gatesOpen: Boolean(state.gatesOpen),
    };
  }

  function isTeleportToken(token) {
    return token >= '1' && token <= '9';
  }

  function moveCell(cell, action) {
    const delta = STEP_DELTAS.find((item) => item.name === action);
    if (!delta) {
      return null;
    }
    return {
      x: cell.x + delta.x,
      y: cell.y + delta.y,
    };
  }

  function parseTemplate(config, floor, seed) {
    const template = config.templates[(floor - 1) % config.templates.length];
    const rows = template.rows;
    const size = rows.length;
    const walls = new Set();
    const items = [];
    const hazards = [];
    const goals = [];
    const boxes = [];
    const switches = [];
    const gates = [];
    const teleporters = [];
    const teleportGroups = new Map();
    let start = null;
    let exit = null;
    let nextItemId = 0;
    let nextHazardId = 0;
    let nextBoxId = 0;

    rows.forEach((row, y) => {
      if (row.length !== size) {
        throw new Error(`Template row width mismatch for ${config.name}: row ${y}`);
      }

      row.split('').forEach((token, x) => {
        const point = { x, y };
        switch (token) {
          case '#':
            walls.add(cellKey(point));
            break;
          case 'c':
            items.push({ id: nextItemId, x, y, active: true });
            nextItemId += 1;
            break;
          case 'h':
            hazards.push({ id: nextHazardId, x, y });
            nextHazardId += 1;
            break;
          case 'g':
            goals.push({ id: goals.length, x, y });
            break;
          case 'b':
            boxes.push({ id: nextBoxId, x, y, locked: false });
            nextBoxId += 1;
            break;
          case 's':
            switches.push({ id: switches.length, x, y });
            break;
          case 'd':
            gates.push({ id: gates.length, x, y });
            break;
          case 'S':
            start = point;
            break;
          case 'X':
            exit = point;
            break;
          default:
            if (isTeleportToken(token)) {
              teleporters.push({ id: token, x, y });
              if (!teleportGroups.has(token)) {
                teleportGroups.set(token, []);
              }
              teleportGroups.get(token).push(point);
            }
            break;
        }
      });
    });

    if (!start || !exit) {
      throw new Error(`Template missing start or exit for ${config.name}`);
    }

    const occupied = new Set([
      ...walls,
      cellKey(start),
      cellKey(exit),
      ...items.map(cellKey),
      ...hazards.map(cellKey),
      ...goals.map(cellKey),
      ...boxes.map(cellKey),
      ...switches.map(cellKey),
      ...gates.map(cellKey),
      ...teleporters.map(cellKey),
    ]);

    if (config.extraHazards) {
      const candidates = config.extraHazards;
      const extraCount = Math.min(config.maxExtraHazards || 0, Math.max(0, floor - 2));
      for (let index = 0; index < extraCount; index += 1) {
        const candidate = candidates[(index + seed + floor) % candidates.length];
        const key = cellKey(candidate);
        if (!occupied.has(key)) {
          occupied.add(key);
          hazards.push({ id: nextHazardId, x: candidate.x, y: candidate.y });
          nextHazardId += 1;
        }
      }
    }

    const teleportMap = new Map();
    teleportGroups.forEach((cells, token) => {
      if (cells.length !== 2) {
        throw new Error(`Teleporter ${token} must appear exactly twice in ${config.name}`);
      }
      teleportMap.set(cellKey(cells[0]), cloneCell(cells[1]));
      teleportMap.set(cellKey(cells[1]), cloneCell(cells[0]));
    });

    return {
      size,
      walls,
      items,
      hazards,
      goals,
      goalKeys: new Set(goals.map(cellKey)),
      boxes,
      switches,
      switchKeys: new Set(switches.map(cellKey)),
      gates,
      gateKeys: new Set(gates.map(cellKey)),
      teleporters,
      teleportMap,
      start,
      exit,
    };
  }

  function createState(config, layout, options) {
    return {
      mode: options.mode || 'idle',
      floor: options.floor || 1,
      hull: options.hull || config.maxHull || 3,
      score: options.score || 0,
      player: cloneCell(layout.start),
      items: layout.items.map((item) => ({ ...item })),
      hazards: layout.hazards.map((hazard) => ({ ...hazard })),
      boxes: layout.boxes.map((box) => ({ ...box })),
      progress: 0,
      turns: 0,
      specialCooldown: 0,
      freezeTurns: 0,
      exitUnlocked: false,
      gatesOpen: Boolean(options.gatesOpen),
      lastAbility: [],
    };
  }

  function findActorIndex(items, cell, predicate) {
    const guard = predicate || (() => true);
    return items.findIndex((item) => sameCell(item, cell) && guard(item));
  }

  function hasWall(layout, cell) {
    return layout.walls.has(cellKey(cell));
  }

  function hasClosedGate(layout, state, cell) {
    return !state.gatesOpen && layout.gateKeys.has(cellKey(cell));
  }

  function hasBlockingTile(layout, state, cell) {
    return hasWall(layout, cell) || hasClosedGate(layout, state, cell);
  }

  function getTeleportDestination(layout, cell) {
    if (!layout.teleportMap) {
      return null;
    }

    const destination = layout.teleportMap.get(cellKey(cell));
    return destination ? cloneCell(destination) : null;
  }

  function hasActiveItem(state, cell) {
    return findActorIndex(state.items, cell, (item) => item.active) !== -1;
  }

  function hasBox(state, cell) {
    return findActorIndex(state.boxes, cell) !== -1;
  }

  function hasHazard(state, cell) {
    return findActorIndex(state.hazards, cell) !== -1;
  }

  function countProgress(config, layout, state) {
    if (config.mode === 'goals') {
      return state.boxes.filter((box) => box.locked).length;
    }
    return state.items.filter((item) => !item.active).length;
  }

  function syncGoals(config, layout, state, outcome) {
    if (config.mode !== 'goals') {
      state.progress = countProgress(config, layout, state);
      state.exitUnlocked = state.progress >= config.target;
      return;
    }

    state.boxes.forEach((box) => {
      if (!box.locked && layout.goalKeys.has(cellKey(box))) {
        box.locked = true;
        state.score += config.scoreGoal || 80;
        outcome.progressed += 1;
      }
    });

    state.progress = countProgress(config, layout, state);
    state.exitUnlocked = state.progress >= config.target;
  }

  function collectItems(config, layout, state, outcome) {
    state.items.forEach((item) => {
      if (item.active && sameCell(item, state.player)) {
        item.active = false;
        state.score += config.scoreItem || 40;
        outcome.progressed += 1;
      }
    });

    state.progress = countProgress(config, layout, state);
    state.exitUnlocked = state.progress >= config.target;
  }

  function clearAdjacentHazards(config, state, outcome) {
    const radius = config.special.radius || 1;
    const removed = [];
    state.hazards = state.hazards.filter((hazard) => {
      const dx = Math.abs(hazard.x - state.player.x);
      const dy = Math.abs(hazard.y - state.player.y);
      const hit = dx + dy <= radius;
      if (hit) {
        removed.push({ x: hazard.x, y: hazard.y });
        state.score += config.scoreHazard || 30;
      }
      return !hit;
    });
    state.lastAbility = removed;
    outcome.clearedHazards += removed.length;
    return removed.length;
  }

  function applyAbility(config, layout, state, outcome) {
    if (state.specialCooldown > 0) {
      outcome.invalid = true;
      outcome.message = `${config.special.label}还需冷却 ${state.specialCooldown} 回合。`;
      return false;
    }

    if (config.special.effect === 'freeze') {
      state.freezeTurns = config.special.duration || 2;
      state.lastAbility = [{ x: state.player.x, y: state.player.y }];
      state.specialCooldown = config.special.cooldown;
      return true;
    }

    const cleared = clearAdjacentHazards(config, state, outcome);
    if (cleared === 0) {
      outcome.invalid = true;
      outcome.message = `附近没有可被${config.special.label}影响的威胁。`;
      return false;
    }
    state.specialCooldown = config.special.cooldown;
    return true;
  }

  function canPushBox(config, layout, state, boxIndex, destination) {
    const box = state.boxes[boxIndex];
    if (box.locked || !inBounds(destination, layout.size) || hasBlockingTile(layout, state, destination)) {
      return false;
    }

    return !state.boxes.some((item) => item.id !== box.id && sameCell(item, destination));
  }

  function triggerSwitch(config, layout, state, outcome) {
    if (state.gatesOpen || layout.switches.length === 0) {
      return;
    }

    if (!layout.switchKeys.has(cellKey(state.player))) {
      return;
    }

    state.gatesOpen = true;
    state.score += config.scoreSwitch || 0;
    outcome.triggeredSwitch = true;
  }

  function resolvePlayerTeleport(layout, state, outcome) {
    const destination = getTeleportDestination(layout, state.player);
    if (!destination) {
      return;
    }

    if (hasBlockingTile(layout, state, destination) || hasBox(state, destination) || hasHazard(state, destination)) {
      return;
    }

    state.player = destination;
    outcome.teleported = true;
  }

  function resolveSlideTeleport(layout, state, cell, usedTeleports) {
    const entryKey = cellKey(cell);
    if (usedTeleports.has(entryKey)) {
      return cell;
    }

    const destination = getTeleportDestination(layout, cell);
    if (!destination) {
      return cell;
    }

    if (hasBlockingTile(layout, state, destination) || hasBox(state, destination) || hasHazard(state, destination)) {
      return cell;
    }

    usedTeleports.add(entryKey);
    usedTeleports.add(cellKey(destination));
    return destination;
  }

  function resolveHazardTeleport(layout, state, hazard, occupiedKeys) {
    const destination = getTeleportDestination(layout, hazard);
    if (!destination) {
      return hazard;
    }

    if (
      hasBlockingTile(layout, state, destination) ||
      hasBox(state, destination) ||
      occupiedKeys.has(cellKey(destination))
    ) {
      return hazard;
    }

    return destination;
  }

  function movePlayerWithSlide(config, layout, state, action, outcome) {
    const delta = STEP_DELTAS.find((item) => item.name === action);
    if (!delta) {
      return false;
    }

    const first = { x: state.player.x + delta.x, y: state.player.y + delta.y };
    if (!inBounds(first, layout.size) || hasBlockingTile(layout, state, first)) {
      outcome.invalid = true;
      outcome.message = '冰轨前方没有可滑行的空间。';
      return false;
    }

    const boxIndex = findActorIndex(state.boxes, first);
    if (boxIndex !== -1) {
      if (!config.pushBoxes || state.boxes[boxIndex].locked) {
        outcome.invalid = true;
        outcome.message = '货箱推不动。';
        return false;
      }

      let boxCursor = cloneCell(first);
      let nextBox = { x: boxCursor.x + delta.x, y: boxCursor.y + delta.y };
      while (
        inBounds(nextBox, layout.size) &&
        !hasBlockingTile(layout, state, nextBox) &&
        !state.boxes.some((item) => item.id !== state.boxes[boxIndex].id && sameCell(item, nextBox))
      ) {
        boxCursor = nextBox;
        nextBox = { x: boxCursor.x + delta.x, y: boxCursor.y + delta.y };
      }

      if (sameCell(boxCursor, first)) {
        outcome.invalid = true;
        outcome.message = '冰面上也推不动这个货箱。';
        return false;
      }

      state.boxes[boxIndex].x = boxCursor.x;
      state.boxes[boxIndex].y = boxCursor.y;
      state.player = first;
      return true;
    }

    let cursor = cloneCell(state.player);
    let moved = false;
    const usedTeleports = new Set();

    for (;;) {
      const next = { x: cursor.x + delta.x, y: cursor.y + delta.y };
      if (!inBounds(next, layout.size) || hasBlockingTile(layout, state, next)) {
        break;
      }
      if (hasBox(state, next)) {
        break;
      }
      cursor = next;
      moved = true;
      const teleportedCursor = resolveSlideTeleport(layout, state, cursor, usedTeleports);
      if (!sameCell(teleportedCursor, cursor)) {
        cursor = teleportedCursor;
        outcome.teleported = true;
      }
      if (hasHazard(state, cursor) || hasActiveItem(state, cursor) || sameCell(cursor, layout.exit)) {
        break;
      }
    }

    if (!moved) {
      outcome.invalid = true;
      outcome.message = '冰轨前方没有可滑行的空间。';
      return false;
    }

    state.player = cursor;
    return true;
  }

  function movePlayer(config, layout, state, action, outcome) {
    if (config.slidePlayer) {
      return movePlayerWithSlide(config, layout, state, action, outcome);
    }

    const destination = moveCell(state.player, action);
    if (!destination || !inBounds(destination, layout.size) || hasBlockingTile(layout, state, destination)) {
      outcome.invalid = true;
      outcome.message = '前方被挡住了。';
      return false;
    }

    const boxIndex = findActorIndex(state.boxes, destination);
    if (boxIndex !== -1) {
      if (!config.pushBoxes) {
        outcome.invalid = true;
        outcome.message = '前方被障碍物堵住了。';
        return false;
      }
      const delta = STEP_DELTAS.find((item) => item.name === action);
      const pushTarget = { x: destination.x + delta.x, y: destination.y + delta.y };
      if (!canPushBox(config, layout, state, boxIndex, pushTarget)) {
        outcome.invalid = true;
        outcome.message = '货箱推不动。';
        return false;
      }
      state.boxes[boxIndex].x = pushTarget.x;
      state.boxes[boxIndex].y = pushTarget.y;
    }

    if (hasHazard(state, destination)) {
      outcome.invalid = true;
      outcome.message = '前方威胁过近，先换路或使用能力。';
      return false;
    }

    state.player = destination;
    resolvePlayerTeleport(layout, state, outcome);
    return true;
  }

  function pickHazardStep(layout, state, hazard, player, occupiedKeys) {
    const currentDistance = Math.abs(hazard.x - player.x) + Math.abs(hazard.y - player.y);
    let best = { x: hazard.x, y: hazard.y };
    let bestDistance = currentDistance;

    STEP_DELTAS.forEach((delta) => {
      const candidate = { x: hazard.x + delta.x, y: hazard.y + delta.y };
      const key = cellKey(candidate);
      if (
        !inBounds(candidate, layout.size) ||
        hasBlockingTile(layout, state, candidate) ||
        hasBox(state, candidate) ||
        occupiedKeys.has(key)
      ) {
        return;
      }

      const distance = Math.abs(candidate.x - player.x) + Math.abs(candidate.y - player.y);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    });

    return best;
  }

  function spreadHazards(config, layout, state) {
    if (!config.spreadHazards || state.hazards.length === 0) {
      return;
    }

    const source = state.hazards[state.turns % state.hazards.length];
    const order = STEP_DELTAS.slice();
    for (let index = 0; index < order.length; index += 1) {
      const delta = order[(index + state.turns) % order.length];
      const candidate = { x: source.x + delta.x, y: source.y + delta.y };
      if (
        inBounds(candidate, layout.size) &&
        !hasBlockingTile(layout, state, candidate) &&
        !hasBox(state, candidate) &&
        !hasHazard(state, candidate) &&
        !sameCell(candidate, layout.exit)
      ) {
        state.hazards.push({ id: state.hazards.length, x: candidate.x, y: candidate.y });
        break;
      }
    }
  }

  function advanceHazards(config, layout, state) {
    if (state.freezeTurns > 0) {
      state.freezeTurns -= 1;
      return;
    }

    const nextPositions = [];
    state.hazards.forEach((hazard, index) => {
      const occupiedKeys = new Set(nextPositions.map(cellKey));
      for (let rest = index + 1; rest < state.hazards.length; rest += 1) {
        occupiedKeys.add(cellKey(state.hazards[rest]));
      }
      const next = pickHazardStep(layout, state, hazard, state.player, occupiedKeys);
      nextPositions.push(resolveHazardTeleport(layout, state, next, occupiedKeys));
    });

    state.hazards = nextPositions.map((hazard, index) => ({ id: index, x: hazard.x, y: hazard.y }));
    spreadHazards(config, layout, state);
  }

  function applyHit(config, layout, state, outcome) {
    state.hull -= 1;
    state.score = Math.max(0, state.score - (config.hitPenalty || 35));
    state.player = cloneCell(layout.start);
    state.specialCooldown = 0;
    state.lastAbility = [];
    outcome.hit = true;

    if (state.hull <= 0) {
      state.mode = 'gameover';
      outcome.gameOver = true;
    }
  }

  function applyAction(config, layout, currentState, action) {
    const state = cloneState(currentState);
    const outcome = {
      state,
      action,
      changed: false,
      invalid: false,
      progressed: 0,
      clearedHazards: 0,
      triggeredSwitch: false,
      teleported: false,
      extracted: false,
      hit: false,
      gameOver: false,
      message: '',
    };

    if (state.mode !== 'active') {
      outcome.invalid = true;
      outcome.message = state.mode === 'gameover' ? config.copy.gameOver : config.copy.boot;
      return outcome;
    }

    state.lastAbility = [];

    if (action === 'ability') {
      if (!applyAbility(config, layout, state, outcome)) {
        return outcome;
      }
    } else if (action !== 'wait') {
      if (!movePlayer(config, layout, state, action, outcome)) {
        return outcome;
      }
    }

    state.turns += 1;
    outcome.changed = true;

    triggerSwitch(config, layout, state, outcome);
    collectItems(config, layout, state, outcome);
    syncGoals(config, layout, state, outcome);

    if (state.exitUnlocked && sameCell(state.player, layout.exit)) {
      state.score += config.scoreClear || 220;
      outcome.extracted = true;
      outcome.message = config.copy.clear;
      return outcome;
    }

    advanceHazards(config, layout, state);
    if (state.hazards.some((hazard) => sameCell(hazard, state.player))) {
      applyHit(config, layout, state, outcome);
      outcome.message = state.mode === 'gameover' ? config.copy.gameOver : config.copy.hit;
      return outcome;
    }

    if (action !== 'ability' && state.specialCooldown > 0) {
      state.specialCooldown -= 1;
    }

    if (state.exitUnlocked) {
      outcome.message = config.copy.unlocked;
    } else if (outcome.triggeredSwitch) {
      outcome.message = config.copy.switch || config.copy.live;
    } else if (outcome.progressed > 0) {
      outcome.message = config.copy.progress;
    } else if (outcome.clearedHazards > 0) {
      outcome.message = config.copy.special;
    } else if (outcome.teleported) {
      outcome.message = config.copy.teleport || config.copy.live;
    } else if (action === 'ability') {
      outcome.message = config.copy.special;
    } else {
      outcome.message = config.copy.live;
    }

    return outcome;
  }

  function runSelfCheck(config, rounds) {
    const checks = [];
    const totalRounds = rounds || 4;

    for (let floor = 1; floor <= totalRounds; floor += 1) {
      const layout = parseTemplate(config, floor, (4242 + floor * 31) >>> 0);
      const state = createState(config, layout, { floor, mode: 'active' });
      const step = applyAction(config, layout, state, 'wait');
      if (!step.changed || step.invalid) {
        return { ok: false, reason: 'wait-failed', floor, details: step };
      }
      checks.push({
        floor,
        size: layout.size,
        hazards: step.state.hazards.length,
      });
    }

    const baseLayout = parseTemplate(config, 1, 4242);
    baseLayout.walls = new Set();
    baseLayout.goalKeys = new Set(baseLayout.goals.map(cellKey));
    baseLayout.start = { x: 0, y: 0 };
    baseLayout.exit = { x: baseLayout.size - 1, y: baseLayout.size - 1 };

    const specialState = createState(config, baseLayout, { floor: 1, mode: 'active', score: 0 });
    specialState.player = { x: 2, y: 2 };
    specialState.hazards = [{ id: 0, x: 2, y: 1 }];
    specialState.items = [];
    specialState.boxes = [];
    const special = applyAction(config, baseLayout, specialState, 'ability');
    if (special.invalid) {
      return { ok: false, reason: 'ability-failed', details: special };
    }

    const progressState = createState(config, baseLayout, { floor: 1, mode: 'active', score: 0 });
    progressState.hazards = [];
    progressState.player = { x: 1, y: 1 };
    if (config.mode === 'goals') {
      baseLayout.goals = [{ id: 0, x: 3, y: 1 }];
      baseLayout.goalKeys = new Set(['3:1']);
      if (config.slidePlayer) {
        baseLayout.walls = new Set(['4:1']);
      }
      progressState.boxes = [{ id: 0, x: 2, y: 1, locked: false }];
      progressState.items = [];
      const moved = applyAction(config, baseLayout, progressState, 'right');
      if (moved.state.progress !== 1 || !moved.state.boxes[0].locked) {
        return { ok: false, reason: 'goal-progress-failed', details: moved };
      }
    } else {
      progressState.items = [{ id: 0, x: 2, y: 1, active: true }];
      progressState.boxes = [];
      const moved = applyAction(config, baseLayout, progressState, 'right');
      if (moved.state.progress !== 1 || moved.state.items[0].active) {
        return { ok: false, reason: 'item-progress-failed', details: moved };
      }
    }

    const extractState = createState(config, baseLayout, {
      floor: 1,
      mode: 'active',
      hull: 2,
      score: 180,
    });
    if (config.mode === 'goals') {
      extractState.boxes = Array.from({ length: config.target }, (_, index) => ({
        id: index,
        x: index,
        y: 0,
        locked: true,
      }));
      extractState.items = [];
    } else {
      extractState.items = Array.from({ length: config.target }, (_, index) => ({
        id: index,
        x: index,
        y: 0,
        active: false,
      }));
      extractState.boxes = [];
    }
    extractState.hazards = [];
    extractState.progress = countProgress(config, baseLayout, extractState);
    extractState.exitUnlocked = true;
    extractState.player = { x: baseLayout.exit.x - 1, y: baseLayout.exit.y };
    const extracted = applyAction(config, baseLayout, extractState, 'right');
    if (!extracted.extracted) {
      return { ok: false, reason: 'extract-failed', details: extracted };
    }

    return {
      ok: true,
      checks,
      special: {
        cooldown: special.state.specialCooldown,
        clearedHazards: special.clearedHazards,
        freezeTurns: special.state.freezeTurns,
      },
      extractionScore: extracted.state.score,
    };
  }

  class GridArcadeGame {
    constructor(config, refs, options) {
      this.config = config;
      this.refs = refs;
      this.canvas = refs.canvas;
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;
      this.seedBase = options.fixedSeed ?? createSeedBase();
      this.autotest = Boolean(options.autotest);
      this.storageAvailable = this.canUseStorage();
      this.bestScore = this.loadRecord(config.storage.score);
      this.bestFloor = this.loadRecord(config.storage.floor);
      this.logs = [];
      this.layout = null;
      this.state = null;
      this.boundKeydown = (event) => this.onKeydown(event);
      this.boundPadClick = (event) => this.onPadClick(event);
      this.bindEvents();
      this.resetRun();
    }

    canUseStorage() {
      try {
        const key = '__grid_arcade__';
        localStorage.setItem(key, '1');
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }

    seedForFloor(floor) {
      return (this.seedBase + floor * 1103515245) >>> 0;
    }

    bindEvents() {
      window.addEventListener('keydown', this.boundKeydown);
      this.refs.start.addEventListener('click', () => this.startRun());
      this.refs.reset.addEventListener('click', () => this.resetRun());
      this.refs.wait.addEventListener('click', () => this.handleAction('wait'));
      this.refs.ability.addEventListener('click', () => this.handleAction('ability'));
      this.refs.restart.addEventListener('click', () => this.resetRun());
      this.refs.pad.addEventListener('click', this.boundPadClick);
    }

    loadRecord(key) {
      if (!this.storageAvailable) {
        return 0;
      }
      try {
        return Number(localStorage.getItem(key) || 0);
      } catch {
        this.storageAvailable = false;
        return 0;
      }
    }

    saveRecord(key, value) {
      if (!this.storageAvailable) {
        return;
      }
      try {
        localStorage.setItem(key, String(value));
      } catch {
        // Keep session records and gameplay running if browser storage becomes unavailable.
        this.storageAvailable = false;
      }
    }

    commitBestScore() {
      if (this.state.score > this.bestScore) {
        this.bestScore = this.state.score;
        this.saveRecord(this.config.storage.score, this.bestScore);
      }
    }

    commitBestFloor(floor) {
      if (floor > this.bestFloor) {
        this.bestFloor = floor;
        this.saveRecord(this.config.storage.floor, this.bestFloor);
      }
    }

    loadFloor(floor, options) {
      const layout = parseTemplate(this.config, floor, this.seedForFloor(floor));
      const state = createState(this.config, layout, {
        floor,
        hull: options.hull,
        score: options.score,
        mode: options.mode,
      });
      this.layout = layout;
      this.state = state;
      this.setStatus(this.state.mode === 'active' ? this.config.copy.live : this.config.copy.boot);
      this.setObjective();
      this.updateHud();
      this.render();
    }

    resetRun() {
      this.logs = [];
      this.loadFloor(1, { hull: this.config.maxHull || 3, score: 0, mode: 'idle' });
      this.pushLog(`${this.config.shortTitle}已重置。`);
      this.setOverlay(this.config.overlay.title, this.config.overlay.body);
    }

    startRun() {
      if (this.state.mode === 'active') {
        return;
      }
      if (this.state.mode === 'gameover') {
        this.resetRun();
      }
      this.state.mode = 'active';
      this.setStatus(this.config.copy.live);
      this.setObjective();
      this.clearOverlay();
      this.pushLog(`第 ${this.state.floor} 轮开始。`);
      this.updateHud();
      this.render();
    }

    pushLog(message) {
      this.logs.unshift(message);
      this.logs = this.logs.slice(0, 6);
      this.refs.feed.innerHTML = this.logs.map((item) => `<li>${item}</li>`).join('');
    }

    setStatus(message) {
      this.refs.status.textContent = message;
    }

    setObjective() {
      if (this.state.mode === 'gameover') {
        this.refs.objective.textContent = this.config.copy.gameOver;
        return;
      }

      if (this.state.exitUnlocked) {
        this.refs.objective.textContent = this.config.objective.exit;
        return;
      }

      if (this.state.specialCooldown === 0) {
        this.refs.objective.textContent = this.config.objective.ready;
        return;
      }

      this.refs.objective.textContent = `${this.config.special.label}还需冷却 ${this.state.specialCooldown} 回合。`;
    }

    setOverlay(title, body) {
      this.refs.overlayTitle.textContent = title;
      this.refs.overlayBody.textContent = body;
      this.refs.overlay.classList.add('is-visible');
    }

    clearOverlay() {
      this.refs.overlay.classList.remove('is-visible');
    }

    onKeydown(event) {
      if (event.repeat || event.defaultPrevented) {
        return;
      }

      if (
        event.target?.closest?.(
          'input, select, textarea, [contenteditable]:not([contenteditable="false"])',
        ) ||
        (
          (event.code === 'Enter' || event.code === 'Space') &&
          event.target?.closest?.('button, a[href], [role="button"]')
        )
      ) {
        return;
      }

      if (event.code === 'Enter') {
        event.preventDefault();
        this.startRun();
        return;
      }

      if (event.code === 'KeyR') {
        event.preventDefault();
        this.resetRun();
        return;
      }

      if (this.state.mode !== 'active') {
        return;
      }

      if (MOVE_KEYS.has(event.code)) {
        event.preventDefault();
        this.handleAction(MOVE_KEYS.get(event.code));
        return;
      }

      if (WAIT_KEYS.has(event.code)) {
        event.preventDefault();
        this.handleAction('wait');
        return;
      }

      if (ABILITY_KEYS.has(event.code)) {
        event.preventDefault();
        this.handleAction('ability');
      }
    }

    onPadClick(event) {
      const button = event.target.closest('[data-action]');
      if (!button) {
        return;
      }
      if (button.dataset.action === 'ability' || button.dataset.action === 'skill') {
        this.handleAction('ability');
        return;
      }
      if (this.state.mode === 'active') {
        this.handleAction(button.dataset.action);
      }
    }

    handleAction(action) {
      const outcome = applyAction(this.config, this.layout, this.state, action);
      if (outcome.invalid) {
        this.setStatus(outcome.message);
        this.pushLog(outcome.message);
        this.setObjective();
        this.updateHud();
        this.render();
        return;
      }

      this.state = outcome.state;
      this.commitBestScore();

      if (outcome.extracted) {
        const clearedFloor = this.state.floor;
        const carriedHull = this.state.hull;
        const carriedScore = this.state.score;
        this.commitBestFloor(clearedFloor);
        this.pushLog(`第 ${clearedFloor} 轮完成。`);
        this.loadFloor(clearedFloor + 1, {
          hull: carriedHull,
          score: carriedScore,
          mode: 'active',
        });
        this.setStatus(this.config.copy.clear);
        this.setObjective();
        this.pushLog(`第 ${this.state.floor} 轮开始。`);
        this.clearOverlay();
        this.updateHud();
        this.render();
        return;
      }

      if (outcome.hit && this.state.mode === 'gameover') {
        this.setOverlay(this.config.overlay.gameOverTitle, this.config.copy.gameOver);
      } else if (outcome.hit) {
        this.setOverlay(this.config.overlay.hitTitle, this.config.overlay.hitBody);
      } else {
        this.clearOverlay();
      }

      this.setStatus(outcome.message);
      this.setObjective();
      this.updateHud();
      this.render();
    }

    updateHud() {
      this.refs.floor.textContent = String(this.state.floor);
      this.refs.score.textContent = String(this.state.score);
      this.refs.hull.textContent = String(this.state.hull);
      this.refs.progress.textContent = `${this.state.progress} / ${this.config.target}`;
      this.refs.special.textContent =
        this.state.specialCooldown === 0 ? '就绪' : `${this.state.specialCooldown} 回合`;
      this.refs.best.textContent = String(this.bestScore);
      this.refs.turns.textContent = String(this.state.turns);
      this.refs.hazards.textContent = String(this.state.hazards.length);
      this.refs.bestFloor.textContent = String(this.bestFloor);
      if (this.refs.progressLabel) {
        this.refs.progressLabel.textContent = this.config.labels.progress;
      }
      if (this.refs.specialLabel) {
        this.refs.specialLabel.textContent = this.config.special.label;
      }
      if (this.refs.abilityAction) {
        this.refs.abilityAction.textContent = this.config.special.button;
      }
      if (this.refs.waitAction) {
        this.refs.waitAction.textContent = this.config.labels.wait;
      }
      if (this.refs.overlayKicker) {
        this.refs.overlayKicker.textContent = this.config.overlay.kicker;
      }
    }

    cellToPixel(cell) {
      const inset = 52;
      const cellSize = (this.canvas.width - inset * 2) / this.layout.size;
      return {
        inset,
        cellSize,
        x: inset + cell.x * cellSize,
        y: inset + cell.y * cellSize,
      };
    }

    drawRect(cell, color, padding) {
      const pos = this.cellToPixel(cell);
      this.ctx.fillStyle = color;
      this.ctx.fillRect(
        pos.x + padding,
        pos.y + padding,
        pos.cellSize - padding * 2 - 2,
        pos.cellSize - padding * 2 - 2,
      );
    }

    render() {
      const palette = this.config.palette;
      const ctx = this.ctx;
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      for (let y = 0; y < this.layout.size; y += 1) {
        for (let x = 0; x < this.layout.size; x += 1) {
          this.drawRect({ x, y }, (x + y) % 2 === 0 ? palette.gridA : palette.gridB, 0);
        }
      }

      this.layout.walls.forEach((key) => {
        const [x, y] = key.split(':').map(Number);
        this.drawRect({ x, y }, palette.wall, 6);
      });

      this.layout.goals.forEach((goal) => {
        this.drawRect(goal, palette.goal, 10);
      });

      this.layout.switches.forEach((tile) => {
        this.drawRect(tile, palette.switch || palette.special, 14);
        this.drawRect(tile, palette.bg, 24);
      });

      this.layout.teleporters.forEach((tile) => {
        this.drawRect(tile, palette.teleport || palette.goal, 12);
        this.drawRect(tile, palette.bg, 22);
        this.drawRect(tile, palette.teleport || palette.goal, 28);
      });

      this.layout.gates.forEach((tile) => {
        this.drawRect(tile, this.state.gatesOpen ? (palette.gateOpen || palette.exitOn) : (palette.gateClosed || palette.wall), 8);
      });

      this.drawRect(this.layout.exit, this.state.exitUnlocked ? palette.exitOn : palette.exitOff, 12);

      this.state.items.forEach((item) => {
        if (item.active) {
          this.drawRect(item, palette.item, 16);
        }
      });

      this.state.boxes.forEach((box) => {
        this.drawRect(box, box.locked ? palette.boxLocked : palette.box, 14);
      });

      this.state.hazards.forEach((hazard) => {
        this.drawRect(hazard, palette.hazard, 18);
      });

      this.state.lastAbility.forEach((cell) => {
        this.drawRect(cell, palette.special, 22);
      });

      this.drawRect(this.state.player, palette.player, 14);
    }

    renderGameToText() {
      return JSON.stringify({
        mode: this.state.mode,
        floor: this.state.floor,
        note: 'origin at top-left; x increases right, y increases downward',
        player: this.state.player,
        progress: this.state.progress,
        items: this.state.items.filter((item) => item.active).map((item) => ({ x: item.x, y: item.y })),
        hazards: this.state.hazards.map((hazard) => ({ x: hazard.x, y: hazard.y })),
        boxes: this.state.boxes.map((box) => ({ x: box.x, y: box.y, locked: box.locked })),
        switches: this.layout.switches.map((tile) => ({ x: tile.x, y: tile.y })),
        gates: this.layout.gates.map((tile) => ({ x: tile.x, y: tile.y })),
        teleporters: this.layout.teleporters.map((tile) => ({ id: tile.id, x: tile.x, y: tile.y })),
        gatesOpen: this.state.gatesOpen,
        exit: {
          x: this.layout.exit.x,
          y: this.layout.exit.y,
          unlocked: this.state.exitUnlocked,
        },
        hull: this.state.hull,
        score: this.state.score,
        turns: this.state.turns,
        specialCooldown: this.state.specialCooldown,
      });
    }

    advanceTime() {
      this.render();
      return this.renderGameToText();
    }
  }

  function findOne(selectors) {
    for (const selector of selectors) {
      if (!selector) {
        continue;
      }
      const node = selector.startsWith('.') ? document.querySelector(selector) : document.getElementById(selector);
      if (node) {
        return node;
      }
    }
    return null;
  }

  function mount(config, options) {
    const refs = {
      canvas: findOne(['game-canvas', 'pixel-canvas']),
      start: findOne(['game-start', 'app-start']),
      reset: findOne(['game-reset', 'app-reset']),
      wait: findOne(['game-wait-action', 'action-wait']),
      ability: findOne(['game-ability-action', 'action-skill']),
      restart: findOne(['game-restart', 'action-restart']),
      pad: findOne(['.pg-pad', '.pixel-pad']),
      overlay: findOne(['game-overlay', 'pixel-overlay']),
      overlayKicker: findOne(['game-overlay-kicker']),
      overlayTitle: findOne(['game-overlay-title', 'overlay-title']),
      overlayBody: findOne(['game-overlay-body', 'overlay-body']),
      floor: findOne(['game-floor', 'stat-stage']),
      score: findOne(['game-score', 'stat-score']),
      hull: findOne(['game-hull', 'stat-life']),
      progress: findOne(['game-progress', 'stat-target']),
      special: findOne(['game-special', 'stat-skill']),
      best: findOne(['game-best', 'stat-best']),
      status: findOne(['game-status', 'status-text']),
      objective: findOne(['game-objective', 'objective-text']),
      turns: findOne(['game-turns', 'metric-turn']),
      hazards: findOne(['game-hazards', 'metric-danger']),
      bestFloor: findOne(['game-best-floor', 'metric-best-stage']),
      feed: findOne(['game-feed', 'feed-list']),
      progressLabel: findOne(['game-progress-label']),
      specialLabel: findOne(['game-special-label']),
      abilityAction: findOne(['game-ability-action', 'action-skill']),
      waitAction: findOne(['game-wait-action', 'action-wait']),
      autotest: findOne(['game-autotest']),
    };

    if (!refs.canvas || !refs.start || !refs.reset || !refs.wait || !refs.ability || !refs.restart || !refs.pad) {
      return null;
    }

    const game = new GridArcadeGame(config, refs, options || {});
    if (options && options.autotest && refs.autotest) {
      refs.autotest.textContent = JSON.stringify(runSelfCheck(config, 4));
    }
    return game;
  }

  const api = {
    parseSeedValue,
    createSeedBase,
    parseTemplate,
    createState,
    applyAction,
    runSelfCheck,
    mount,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof window !== 'undefined') {
    window.GridArcadeCore = api;
  }
})();
