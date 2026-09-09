import type { ProcessRequest } from "./types.js";

export function isInScope(request: ProcessRequest): boolean {
  return request.isCodingProblem && request.code.trim().length > 0;
}
