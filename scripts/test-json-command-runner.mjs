import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

import {
  createSuiteLabel,
  formatDurationMs,
  runJsonCommand,
} from './json-command-runner.mjs';
import {
  deriveBrowserCaptureEnv,
  discoverBrowserSuitesFromScripts,
} from './browser-suite-discovery.mjs';
import { startStaticServer } from './static-server.mjs';
import { listLogicScripts } from './test-logic-suite.mjs';

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getWithAgent(url, agent) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, { agent }, (response) => {
      response.resume();
      response.on('end', resolve);
      response.on('error', reject);
    });
    request.on('error', reject);
  });
}

assert.equal(formatDurationMs(950), '950ms');
assert.equal(formatDurationMs(1250), '1.3s');
assert.equal(createSuiteLabel({ index: 3, total: 12, key: 'indexMenu' }), '[3/12] indexMenu');
assert.equal(deriveBrowserCaptureEnv('prism-relay'), 'PRISM_RELAY_CAPTURE');

const discoveredSuites = discoverBrowserSuitesFromScripts({
  'test:browser': 'node scripts/test-browser-suite.mjs',
  'test:logic': 'node scripts/test-logic-suite.mjs',
  'test:index-menu:browser': 'node scripts/test-index-menu-browser.mjs',
  'test:prism-relay:browser': 'node scripts/test-prism-relay-browser.mjs',
  'test:prism-relay:logic': 'node scripts/test-prism-relay-mechanics.mjs',
});

assert.deepEqual(discoveredSuites, [
  {
    key: 'indexMenu',
    scriptName: 'test:index-menu:browser',
    script: 'scripts/test-index-menu-browser.mjs',
    captureEnv: 'INDEX_MENU_CAPTURE',
  },
  {
    key: 'prismRelay',
    scriptName: 'test:prism-relay:browser',
    script: 'scripts/test-prism-relay-browser.mjs',
    captureEnv: 'PRISM_RELAY_CAPTURE',
  },
]);

const okPayload = await runJsonCommand({
  command: process.execPath,
  args: ['-e', 'console.log(JSON.stringify({ ok: true, value: 7 }))'],
  cwd: process.cwd(),
  timeoutMs: 1_000,
});

assert.deepEqual(okPayload, { ok: true, value: 7 });

await assert.rejects(
  () =>
    runJsonCommand({
      command: process.execPath,
      args: ['-e', 'setTimeout(() => console.log(JSON.stringify({ ok: true })), 200)'],
      cwd: process.cwd(),
      timeoutMs: 50,
    }),
  /timed out after 50ms/,
);

const retryDir = await fs.mkdtemp(path.join(os.tmpdir(), 'democodex-json-runner-'));
const retryMarker = path.join(retryDir, 'attempt');

try {
  const retryScript = `
    const fs = require('node:fs');
    const marker = process.env.DEMOCODEX_RETRY_MARKER;
    if (!fs.existsSync(marker)) {
      fs.writeFileSync(marker, '1');
      setTimeout(() => {}, 2000);
    } else {
      console.log(JSON.stringify({ ok: true, attempt: 2 }));
    }
  `;
  const retryPayload = await runJsonCommand({
    command: process.execPath,
    args: ['-e', retryScript],
    cwd: process.cwd(),
    env: { DEMOCODEX_RETRY_MARKER: retryMarker },
    timeoutMs: 250,
    attempts: 2,
  });

  assert.deepEqual(retryPayload, { ok: true, attempt: 2 });
} finally {
  await fs.rm(retryDir, { recursive: true, force: true });
}

const server = await startStaticServer({ rootDir: process.cwd() });
const agent = new http.Agent({ keepAlive: true });
let closePromise = null;

try {
  await getWithAgent(`${server.url}/index.html`, agent);
  closePromise = server.close();
  const closed = await Promise.race([closePromise.then(() => true), delay(200).then(() => false)]);
  assert.equal(closed, true, 'static server should close promptly with idle keep-alive connections');
} finally {
  agent.destroy();
  if (closePromise) {
    await closePromise.catch(() => {});
  } else {
    await server.close().catch(() => {});
  }
}

assert.ok(listLogicScripts().includes('test:rift-stitch:logic'), 'Rift mechanics must run in npm test');
const riftResult = await runJsonCommand({
  command: process.execPath,
  args: ['scripts/test-rift-stitch-logic.mjs'],
  cwd: process.cwd(),
});
assert.equal(riftResult.ok, true);
assert.ok(riftResult.count >= 55, 'All existing Rift mechanics tests must run');
assert.equal(riftResult.failed, 0);

const nodeFixtureDir = await fs.mkdtemp(path.join(os.tmpdir(), 'democodex-node-tests-'));
try {
  const failingTest = path.join(nodeFixtureDir, 'failing.test.mjs');
  await fs.writeFile(failingTest, "import test from 'node:test'; import assert from 'node:assert/strict'; test('intentional failure fixture', () => assert.equal(1, 2));\n");
  await assert.rejects(() => runJsonCommand({
    command: process.execPath,
    args: ['scripts/test-rift-stitch-logic.mjs', failingTest],
    cwd: process.cwd(),
  }), /intentional failure fixture/);
  const passingTest = path.join(nodeFixtureDir, 'passing.test.mjs');
  await fs.writeFile(passingTest, "import test from 'node:test'; test('passing fixture', () => {});\n");
  const passed = await runJsonCommand({
    command: process.execPath,
    args: ['scripts/test-rift-stitch-logic.mjs', passingTest],
    cwd: process.cwd(),
  });
  assert.deepEqual(passed, { ok: true, count: 1, passed: 1, failed: 0 });
} finally {
  await fs.rm(nodeFixtureDir, { recursive: true, force: true });
}

console.log(JSON.stringify({ ok: true, checks: 12 }));
