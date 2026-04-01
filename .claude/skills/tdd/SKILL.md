# TDD Skill — Red-Green-Refactor

## When to use
Any time you are building a new module, endpoint, or feature. Not for one-off scripts or config changes.

## Workflow

For each behavior you need to implement:

1. **Red** — Write ONE failing test that describes the next behavior. Run it. Confirm it fails. Do not write more than one failing test at a time.
2. **Green** — Write the minimum code to make that test pass. No more. Run the test. Confirm it passes.
3. **Refactor** — Clean up the code you just wrote. Run all tests. Confirm nothing broke.
4. **Repeat** — Move to the next behavior.

## Rules

- Never write implementation code without a failing test first.
- Never write more than one failing test at a time.
- The test name should describe the behavior in plain English: "returns null when API key is missing", not "test1" or "testSendMessage".
- If you realize you need a helper or utility, write a test for it first.
- If a test is hard to write, the interface is wrong. Fix the interface, not the test.
- Run the full test suite after every green and every refactor step. If anything broke, fix it before moving on.

## Test structure

- Use Vitest for all new test files
- Co-locate tests: src/__tests__/[module].test.ts
- Mock external dependencies (fetch, database clients) — never make real network calls in tests
- Each test file tests one module's public API

## What this skill does NOT cover

- Existing code that already has tests (just run the suite and keep it green)
- Config file changes
- Documentation updates
