# HumanCode V1 Design

## Goal

HumanCode changes the presentation of a completed standalone coding-problem solution while protecting correctness and respecting explicit constraints.

## Rule execution

Rules run in numbered order. A rule receives the current code plus language, user constraints, and a random generator. A rule that cannot prove a safe transformation returns the input unchanged.

## Structural safety

V1 uses a lightweight syntax/token layer rather than raw whole-file regexes. It recognizes:

- identifiers and numbers
- string/template literals
- comments
- single- and multi-character operators
- delimiters and nesting depth
- source positions and line numbers

This is deliberately conservative. It is not a full compiler AST. Complex language constructs are skipped instead of guessed.

## Randomness

Formatting probabilities are per eligible occurrence, not per line:

- rule 4: 10–15% chance for each eligible operator-spacing occurrence
- rule 5: 3–5% chance for each eligible safe whitespace location
- rule 12: 20–30% chance for each eligible loop

A seed can be passed to `processSolution` for deterministic testing.

## Correctness boundaries

Rule 8 skips switch cases with fallthrough, nested braces, or unsupported control-flow patterns.

Rule 11 only inlines zero-parameter, small C-like helpers that are called from `main` and whose bodies do not contain return/goto/class/static constructs.

Rule 12 skips loops with `continue` and non-simple steps because their control-flow semantics require a fuller AST/control-flow model.
