# HumanCode V2 Architecture

```text
MCP / caller
    |
    v
Scope Guard
    |
    v
Tree-sitter Parser
    |
    +--> syntax validity / error nodes
    |
    v
AST-aware Rule Engine
    |
    +--> identifier rules
    +--> structural rules
    +--> token-aware formatting rules
    |
    v
Reparse output
    |
    +--> valid: accept
    +--> invalid: rollback to original
```

## Why the parser is mandatory

Regex can find text that looks like a function, switch, or loop without knowing whether it is code, a property, a nested declaration, or a syntactically special construct. V2 therefore uses Tree-sitter as the structural eligibility layer. The parser is intentionally not hidden behind a permissive fallback: missing parser dependencies cause a safe skip.

## Transform policy

A rule may return the original code. That is a valid result. HumanCode prioritizes correctness over maximizing the number of visible transformations.

The final parse is a safety net, not a proof of semantic equivalence. Rules still need conservative preconditions and must avoid transformations that obviously alter scope, evaluation order, return/reference behavior, fall-through, or language-specific semantics.
