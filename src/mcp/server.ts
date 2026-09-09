import { createServer } from "node:http";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { mcpHandler, buildServer } from "./http.js";
import { loadConfig } from "./config.js";
import { authorized } from "./auth.js";
import { RateLimiter } from "./rate-limit.js";
import { health } from "./health.js";

function clientKey(req: { socket: { remoteAddress?: string } }): string {
  return req.socket.remoteAddress ?? "unknown";
}

function sendJson(res: import("node:http").ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  });
  res.end(JSON.stringify(body));
}

function startHttp() {
  const config = loadConfig();
  const handler = toNodeHandler(mcpHandler);
  const limiter = new RateLimiter(config.maxRequestsPerMinute);
  const pruneTimer = setInterval(() => limiter.prune(), 60_000);
  pruneTimer.unref();

  const server = createServer((req, res) => {
    const path = req.url?.split("?", 1)[0] ?? "";
    res.setHeader("x-content-type-options", "nosniff");
    res.setHeader("cache-control", "no-store");

    if (path === config.healthPath && req.method === "GET") {
      sendJson(res, 200, health(config.version));
      return;
    }

    if (path !== config.path) {
      sendJson(res, 404, { error: "not_found" });
      return;
    }

    if (!authorized(req.headers, config.authToken)) {
      res.setHeader("www-authenticate", "Bearer");
      sendJson(res, 401, { error: "unauthorized" });
      return;
    }

    if (!limiter.allow(clientKey(req))) {
      res.setHeader("retry-after", "60");
      sendJson(res, 429, { error: "rate_limited" });
      return;
    }

    void handler(req, res);
  });

  server.listen(config.port, config.host, () => {
    console.error(`HumanCode MCP ${config.version} listening on ${config.host}:${config.port}${config.path}`);
  });
}

if (process.argv.includes("--http")) startHttp();
else serveStdio(buildServer);
