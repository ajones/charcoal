# Remaining Gaps

Living document tracking what needs to be implemented, removed, or replaced.
**Core constraint: Charcoal operates on git only. No specific git provider (GitHub, GitLab, etc.) is required.**

---

## Provider-Coupled Code to Remove or Rethink

These features are tightly coupled to GitHub and need to be either removed or replaced with provider-agnostic alternatives.

### Remove outright
| Command / File | Why |
|---|---|
| `gt repo name` | Stores repo name for Graphite's hosted service |
| `gt repo owner` | Stores GitHub owner for Graphite's hosted service |
| `gt repo pr-templates` | Reads GitHub PR templates |
| `gt user submit-body` | Configures GitHub PR body defaults |
| `src/actions/create_pr_body_footer.ts` | Injects Graphite branding into PR body |
| `src/background_tasks/fetch_pr_info.ts` | Background fetch of PR state from GitHub API |
| `src/actions/sync_pr_info.ts` | Syncs PR open/closed/merged state from GitHub — used by `sync` and `clean_branches` to decide what to delete |
| `src/lib/api/pr_info.ts` | GitHub API client |

### Rethink / replace
| Command / File | Issue | Direction |
|---|---|---|
| `gt submit` (all variants) | Creates/updates GitHub PRs via API | Replace with `git push` to the configured remote and print the push URL. Drop PR creation entirely. |
| `gt branch info` | Shows PR status from GitHub | Strip PR fields; show only local branch metadata (parent, commits, diff stat) |
| `src/actions/sync/clean_branches.ts` | Uses PR open/closed state from GitHub to decide which branches to delete | Fall back to `git merge-base` / `isMergedIntoTrunk` — already available on the engine — instead of PR state |
| `gt repo disable_github` | Toggle for GitHub integration | Can be removed once GitHub integration is fully stripped |

---


## Unimplemented Features (net-new work required)

### `gt downstack get` / `gt get`
The `getAction` function exists but is a stub that prints "not yet implemented". The underlying `getBranchesFromRemote` logic in `src/actions/sync/get.ts` is fully written and provider-agnostic (pure git fetch + rebase). Needs:
- Wire `getAction` to call `getBranchesFromRemote`
- Add top-level `gt get` shorthand

### `gt absorb`
Amends staged changes into the relevant downstack commit (finds the commit that last touched the staged files and amends it in-place, then restacks). No implementation exists. Pure git operation.

### `gt undo`
Undo the most recent Graphite mutation. Would need a lightweight operation log persisted in `.git/` (similar to how `continueConfig` works) to snapshot pre-mutation state and restore it.

### `gt reorder`
Interactive reordering of branches within the current stack. Similar to `downstack edit` but scoped to the full stack. `downstack edit` may already cover this.

### `gt repo fix`
Scan for and auto-fix common metadata corruption (orphaned refs, mismatched parents, etc.). Would use existing engine methods.
  
### Shell completion for fish / zsh / bash
- Fish completion (`gt fish`) exists
- `gt completion` for bash/zsh exists
- Neither is tested or verified to work well with the new top-level commands added in this fork

---

## Graphite Branding / References to Clean Up

These are not functional gaps but should be cleaned up for Charcoal's identity:

- `src/actions/sync/get.ts` — message references `github.com/danerwilliams/charcoal/issues/6`
- `src/commands/auth.ts` — description mentions "Graphite"
- `src/lib/spiffy/user_config_spf.ts` and others — config stored under `~/.graphite/`; consider migrating to `~/.charcoal/`
- Strings referencing "Graphite" in log/tip messages throughout `src/actions/` and `src/commands/`
- `src/commands/repo-commands/repo_disable_github.ts` — exposes a toggle that will be irrelevant once GitHub integration is removed
