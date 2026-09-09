# HumanCode V2.3 verification

## Static checks

- package version is 2.3.0
- HTTP entrypoint exists
- health endpoint exists
- optional Bearer authentication exists
- per-source-IP rate limiting exists
- Docker build definition exists
- deployment checklist exists
- existing V2 parser/fail-closed architecture is retained

## Environment limitation

This workspace has repeatedly timed out while downloading npm dependencies. Therefore this artifact does **not** claim a dependency-installed `npm test` or a live ChatGPT connection.

The `verification/smoke.mjs` test only checks the deployment wiring that can be verified without installing external packages.
