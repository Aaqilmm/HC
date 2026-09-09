# HumanCode → ChatGPT Apps/MCP integration

HumanCode is a narrow MCP backend: it post-processes an already-generated standalone solution to a single coding problem. It is not a repository refactoring agent and does not inspect project folders.

## Tool

`humanize_coding_problem_solution`

The server accepts:

- `code`
- `language`
- `isCodingProblem`
- optional `userConstraints`
- optional deterministic `seed`

The backend returns the transformed code plus machine-readable status fields.

## Runtime

```text
ChatGPT
  ↓
Apps / MCP
  ↓ HTTPS
HumanCode /mcp
  ↓
scope guard
  ↓
parser + AST safety gate
  ↓
12-rule engine
  ↓
output parse + rollback
```

The server is intentionally stateless. No database is required.

## Tool-use behavior

The model decides whether to call the tool. HumanCode therefore does not and cannot guarantee interception of every generated coding answer. The tool description is narrow, while the backend independently rejects `isCodingProblem=false` and unsupported inputs.

OpenAI's current API documentation also exposes remote MCP as a tool type, reinforcing this architecture.
