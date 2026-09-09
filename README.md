# HumanCode V2.2

Parser-backed, fail-closed post-processing for standalone coding-problem solutions.

Supported languages: C++, Python, Java, JavaScript, TypeScript.

The processor parses input, applies conservative transformations, reparses the output, and rolls back on syntax failure. Structural rules use Tree-sitter nodes/ranges rather than treating regex as a parser.

This project is not intended for repositories, multi-file projects, project-wide refactors, or general debugging.


## ChatGPT app integration

HumanCode exposes a narrow MCP tool for standalone coding-problem solutions. See `docs/CHATGPT-INTEGRATION.md` and `docs/APP-SUBMISSION.md` for the current Apps SDK integration flow.
