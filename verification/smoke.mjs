import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const required = [
  "src/mcp/config.ts",
  "src/mcp/auth.ts",
  "src/mcp/rate-limit.ts",
  "src/mcp/server.ts",
  "src/mcp/http.ts",
  "Dockerfile",
  "docs/DEPLOYMENT.md"
];
for (const file of required) assert.ok(existsSync(file), `missing ${file}`);

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert.equal(pkg.version, "2.3.0");
assert.equal(pkg.scripts.start, "node dist/mcp/server.js");
assert.equal(pkg.scripts["start:http"], "node dist/mcp/server.js --http");

const server = readFileSync("src/mcp/server.ts", "utf8");
assert.match(server, /authorized\(/);
assert.match(server, /RateLimiter/);
assert.match(server, /health\(/);
console.log("HumanCode V2.3 deployment smoke checks: PASS");
