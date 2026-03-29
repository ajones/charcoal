# Charcoal — Agent Guide

Charcoal is a TypeScript CLI for managing stacked pull requests, forked from the Graphite CLI. It lives in a Yarn 3 monorepo with two workspaces: `apps/cli` (the CLI) and `libs/gti-cli-shared-types` (shared TypeScript types).

## Environment Setup

```bash
nvm use                   # Node 18.17.1 (see .nvmrc)
npm install -g yarn turbo # if not already installed
yarn install              # install all workspace dependencies
turbo run build           # build entire monorepo
```

## Common Commands

| Task | Command |
|------|---------|
| Build everything | `turbo run build` |
| Build CLI only | `cd apps/cli && yarn build` |
| Run tests | `cd apps/cli && yarn test` |
| Run tests (CI/coverage) | `cd apps/cli && yarn test-ci` |
| Run single test | `cd apps/cli && yarn test-one "<dist/test/path.js>"` |
| Grep tests | `cd apps/cli && yarn test-grep "<pattern>"` |
| Lint | `cd apps/cli && yarn lint` |
| Type check | `cd apps/cli && yarn check` |
| Run CLI from source | `cd apps/cli && yarn cli <command>` |
| Link `gt` globally | `cd apps/cli && yarn dev` |

## Repository Layout

```
charcoal/
├── apps/cli/
│   ├── src/
│   │   ├── index.ts                  # yargs entry point
│   │   ├── commands/                 # command files (auto-discovered by yargs.commandDir)
│   │   │   ├── branch-commands/
│   │   │   ├── commit-commands/
│   │   │   ├── stack-commands/
│   │   │   ├── downstack-commands/
│   │   │   ├── upstack-commands/
│   │   │   ├── log-commands/
│   │   │   ├── repo-commands/
│   │   │   └── ...
│   │   ├── actions/                  # business logic (submit, sync, edit, etc.)
│   │   ├── lib/
│   │   │   ├── engine/               # branch/stack state & metadata
│   │   │   ├── git/                  # low-level git wrappers (30+ files)
│   │   │   ├── spiffy/               # config persistence (~/.graphite/, .git/)
│   │   │   ├── api/                  # GitHub API helpers
│   │   │   ├── utils/                # splog, prompts, spawning, etc.
│   │   │   ├── context.ts            # TContext / TContextLite — app-wide services
│   │   │   ├── errors.ts             # custom error classes
│   │   │   └── runner.ts             # command runner
│   │   └── background_tasks/
│   └── test/
│       ├── commands/
│       ├── actions/
│       └── lib/
│           ├── scenes/               # test fixtures (basic_scene, public_repo_scene, etc.)
│           └── utils/
├── libs/gti-cli-shared-types/src/    # shared TypeScript types
├── turbo.json
├── package.json
└── .github/workflows/                # push.yml, pull_request.yml
```

## Architecture

**Execution flow:** CLI command → Action → Engine / Git layer

- **Context (`TContext`)** — passed to every action; holds `splog`, configs, engine, prompts, and git operations
- **Engine (`TEngine`)** — manages branch hierarchy and metadata; caches state in `.git/`
- **Git layer** — thin wrappers in `src/lib/git/` for each git operation; no business logic
- **Actions** — reusable business logic in `src/actions/`; shared across multiple commands
- **Spiffy** — config persistence framework; user config in `~/.graphite/`, repo config in `.git/`

## Code Conventions

- **TypeScript strict mode** — `strict: true`, `noImplicitReturns`, `noUnusedLocals`
- **No default exports** — always use named exports
- **No `process.exit()`** — use early returns so telemetry can flush cleanly
- **No `console.log`** — use `splog.info()` / `splog.error()` / `splog.plain()`
- **Max 120 lines per function**, max 3 parameters
- **Unused variables** must be prefixed with `_`
- **Floating promises must be caught**
- **Type naming** — interfaces/types use a `T` prefix (e.g., `TContext`, `TEngine`)

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by CommitLint):

```
<type>: <short summary>
```

Valid types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, `util`, `config`

## Testing

Tests use Mocha + Chai + ts-mocha. They run in parallel (8 jobs). Test fixtures are "scenes" in `test/lib/scenes/` that set up git repos in a temporary directory.

- Tests read/write real git repos — do not mock the engine or git layer in integration tests
- Always build before running tests (`turbo run build` or `yarn build` in `apps/cli`)

## CI/CD

- **PR workflow** — lint, build, full test suite with coverage (NYC)
- **Push to main / version tags** — tests across Node 14–current, binary builds (macOS x86, Linux), GitHub release on version tags
- Binaries are built with `pkg`; macOS ARM must be built and hashed manually for the Homebrew tap

## Release

1. Tag the commit: `git tag v0.x.y && git push origin v0.x.y`
2. CI builds macOS (x86) and Linux binaries and publishes a GitHub prerelease automatically
3. macOS ARM binary must be built locally and its SHA256 updated in the Homebrew tap manually
