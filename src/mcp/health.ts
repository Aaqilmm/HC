export interface HealthResponse {
  status: "ok";
  service: "humancode";
  version: string;
  protocol: "mcp";
}

export function health(version = "2.3.0"): HealthResponse {
  return { status: "ok", service: "humancode", version, protocol: "mcp" };
}
