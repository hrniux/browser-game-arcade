import path from 'node:path';
import { run } from 'node:test';
import { fileURLToPath } from 'node:url';

const defaultTest = fileURLToPath(new URL('./test-rift-stitch-mechanics.mjs', import.meta.url));
const files = process.argv.length > 2 ? process.argv.slice(2).map((file) => path.resolve(file)) : [defaultTest];
let passed = 0;
let failed = 0;

// Consume Node's supported event stream so suite stdout stays JSON-only.
for await (const { type, data } of run({ files })) {
  if (type === 'test:pass') passed += 1;
  if (type === 'test:fail') {
    failed += 1;
    console.error(`${data.name}: ${data.details?.error?.cause || data.details?.error || 'Test failed'}`);
  }
  if (type === 'test:stderr') process.stderr.write(data.message);
}

const count = passed + failed;
const ok = count > 0 && failed === 0;
console.log(JSON.stringify({ ok, count, passed, failed }));
if (!ok) process.exitCode = 1;
