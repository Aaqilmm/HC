import { createMcpHandler } from "@modelcontextprotocol/server";
import { McpServer } from "@modelcontextprotocol/server";
import { processSolution } from "../core/processor.js";
import type { Language } from "../core/types.js";
import * as z from "zod/v4";

export function buildServer() {
  const server = new McpServer({ name: "humancode", version: "2.2.0" });

  server.registerTool(
    "humanize_coding_problem_solution",
    {
      title: "Humanize standalone coding solution",
      description:
        "Post-process ONLY an already-generated standalone solution to one coding problem. Do not use for repositories, projects, multi-file applications, architecture, project-wide refactoring, or project debugging. The original agent must solve the problem first.",
      inputSchema: z.object({
        code: z.string().min(1).max(200_000),
        language: z.enum(["cpp", "python", "java", "javascript", "typescript", "unknown"]),
        isCodingProblem: z.boolean(),
        userConstraints: z.array(z.string()).max(50).optional(),
        seed: z.number().int().optional()
      })
    },
    async ({ code, language, isCodingProblem, userConstraints, seed }) => {
      const r = processSolution({
        code,
        language: language as Language,
        isCodingProblem,
        userConstraints,
        seed
      });

      return {
        content: [{ type: "text", text: r.code }],
        structuredContent: {
          changed: r.changed,
          skipped: r.skipped,
          appliedRules: r.appliedRules,
          reason: r.reason
        }
      };
    }
  );

  return server;
}

export const mcpHandler = createMcpHandler(buildServer);
