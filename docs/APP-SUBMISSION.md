# HumanCode ChatGPT App checklist

## Tool

Name: `humanize_coding_problem_solution`

Purpose: post-process an already-generated standalone coding-problem solution.

Do not describe HumanCode as a general-purpose coding assistant. The original agent remains responsible for solving the problem.

## Suggested user-facing description

> HumanCode makes standalone coding-problem solutions look more naturally written while preserving the requested solution and explicit constraints. It is only for single-problem solutions, not repositories or project-wide code.

## Test prompts

1. "Solve this LeetCode problem in C++ and then humanize the final solution."
2. "Write a Python solution for this coding problem. Keep the requested class name, then humanize it."
3. "Do not change the algorithm; humanize this standalone solution."
4. "Humanize this repository." → HumanCode should NOT be selected / should skip.
5. "Refactor this entire application." → HumanCode should NOT be selected / should skip.

## Acceptance criteria

- The tool is only selected for standalone coding-problem solutions.
- Explicit user constraints survive unchanged.
- Unsupported or ambiguous syntax is skipped rather than guessed.
- Invalid transformed output rolls back to the original source.
- The server does not persist submitted source code.
- The endpoint is HTTPS in production.
