# HumanCode deployment

HumanCode V2.3 exposes one MCP tool and a health endpoint.

## Endpoints

- MCP: `/mcp` (or `MCP_PATH`)
- Health: `/health` (or `HEALTH_PATH`)

The health endpoint is intentionally unauthenticated so a hosting platform can probe it. The MCP endpoint can be protected with `HUMANCODE_AUTH_TOKEN`.

## Environment

- `HOST` — bind address; default `0.0.0.0`
- `PORT` — default `3000`
- `MCP_PATH` — default `/mcp`
- `HEALTH_PATH` — default `/health`
- `HUMANCODE_AUTH_TOKEN` — optional Bearer token
- `RATE_LIMIT_PER_MINUTE` — default `60` per source IP

## Docker

```bash
docker build -t humancode .
docker run --rm -p 3000:3000 -e HUMANCODE_AUTH_TOKEN='change-me' humancode
```

Put TLS in front of the container. Do not expose a bearer token in source control or logs.

## ChatGPT/App connection

Use the public HTTPS MCP URL ending in `/mcp` when configuring the app. The model can decide when to invoke the tool; the server still enforces scope and safety independently.

OpenAI's current developer documentation describes apps as MCP-backed experiences and the API supports remote MCP tool calls. Availability of custom apps/MCP features depends on the ChatGPT workspace and plan, so verify the account's current developer-mode access before deployment.

## Production checklist

- [ ] HTTPS termination
- [ ] Secret stored in hosting provider's secret manager
- [ ] Health probe points to `/health`
- [ ] Rate limit configured for expected traffic
- [ ] Source-code request logging disabled
- [ ] Container runs as non-root
- [ ] MCP endpoint reachable over HTTPS
- [ ] Tool appears in the ChatGPT app's tool list
- [ ] Out-of-scope repository/project requests are rejected
