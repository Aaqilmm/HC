export interface ServerConfig {
  host: string;
  port: number;
  path: string;
  healthPath: string;
  version: string;
  authToken?: string;
  maxRequestsPerMinute: number;
}

function positiveInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export function loadConfig(): ServerConfig {
  return {
    host: process.env.HOST ?? "0.0.0.0",
    port: positiveInt(process.env.PORT, 3000),
    path: process.env.MCP_PATH ?? "/mcp",
    healthPath: process.env.HEALTH_PATH ?? "/health",
    version: "2.3.0",
    authToken: process.env.HUMANCODE_AUTH_TOKEN || undefined,
    maxRequestsPerMinute: positiveInt(process.env.RATE_LIMIT_PER_MINUTE, 60)
  };
}
