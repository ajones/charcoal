# Graphite CLI (`gt`) — Complete Command Reference

## Global Flags

| Flag | Description |
|---|---|
| `--help` / `-h` | Show help for a command |
| `--allCommands` | Print full list of command help |
| `--cwd` | Set working directory for operations |
| `--debug` | Write debug output to terminal |
| `--interactive` | Enable interactive features (default: enabled) |
| `--verify` | Enable git hooks (default: enabled) |
| `--quiet` / `-q` | Minimize terminal output |

---

## Command Structure

Noun-verb commands can be typed any of these equivalent ways:
- `gt branch create`
- `gt b create`
- `gt branch c`
- `gt b c`
- `gt bc`

---

## `auth`

Add your auth token to enable Graphite CLI to create and update PRs on GitHub.

**Flags:**
- `-t, --token` — Provide auth token directly (obtain at https://app.graphite.dev/activate)

---

## `branch` (`b`)

| Subcommand | Alias | Description |
|---|---|---|
| `branch bottom` | `bb` | Switch to the first branch from trunk in the current stack. |
| `branch checkout` | `bco` | Switch to a branch (interactive). |
| `branch children` | — | List child branches tracked by Graphite. |
| `branch create [name]` | `bc` | Create a new branch stacked on top of the current branch and commit staged changes. |
| `branch delete` | `bdl` | Delete a branch and its corresponding Graphite metadata. |
| `branch down` | `bd` | Switch to the parent of the current branch. |
| `branch edit` | `be` | Run an interactive rebase on the current branch's commits and restack upstack branches. |
| `branch fold` | `bf` | Fold a branch's changes into its parent, update dependencies of descendants, and restack. |
| `branch info` | `bi` | Display information about the current branch. |
| `branch parent` | — | Show the parent branch. |
| `branch rename` | `brn` | Rename a branch and update metadata referencing it. Note: removes any associated GitHub pull request. |
| `branch restack` | `br` | Ensure the current branch is based on its parent, rebasing if necessary. |
| `branch split` | `bsp` | Split the current branch into multiple branches. |
| `branch squash` | `bsq` | Squash all commits in the current branch and restack upstack branches. |
| `branch submit` | `bs` | Idempotently force push the current branch to GitHub, creating or updating a pull request. |
| `branch top` | `bt` | Switch to the tip branch of the current stack. Prompts if ambiguous. |
| `branch track` | `btr` | Start tracking the current branch with Graphite by selecting its parent. |
| `branch untrack` | `but` | Stop tracking a branch with Graphite. If the branch has children, they will also be untracked. |
| `branch up` | `bu` | Switch to the child of the current branch. Prompts if ambiguous. |

### `branch checkout` flags
- `--branch <name>` — Specify branch directly
- `-a, --all` — Show all configured trunk branches
- `-u, --show-untracked` — Include untracked branches
- `-s, --stack` — Show current stack only
- `-t, --trunk` — Checkout current trunk

### `branch create [name]` flags
- `--ai` — Auto-generate branch name from commit message
- `--no-ai` — Disable AI generation
- `-a, --all` — Stage all changes including untracked
- `-i, --insert` — Insert between current branch and its child (rebases existing children onto new branch)
- `-m, --message` — Specify commit message
- `-p, --patch` — Pick hunks interactively
- `-u, --update` — Stage tracked file updates
- `-v, --verbose` — Show diff

### `branch delete` flags
- `-f, --force` — Delete regardless of merge status
- `-c, --close` — Close associated PRs
- `--downstack` — Also delete ancestors
- `--upstack` — Also delete descendants

### `branch down` flags
- `-n, --steps <number>` — Number of levels to traverse

### `branch fold` flags
- `-k, --keep` — Keep the name of the current branch instead of using the parent's name

### `branch info` flags
- `-b, --body` — Show PR body
- `-d, --diff` — Show branch diff
- `-p, --patch` — Show commit changes
- `-s, --stat` — Show diffstat

### `branch rename` flags
- `-f, --force` — Force rename even with open PR

### `branch split` flags
- `-c, --commit, --by-commit` — Split by commit
- `-f, --file, --by-file <pathspec>` — Split by file pattern (repeatable)
- `-h, --hunk, --by-hunk` — Split by hunk (interactive `git add --patch`)

### `branch squash` flags
- `--edit` — Modify the existing commit message
- `-m, --message` — Provide new commit message
- `-n, --no-edit` — Keep existing message

### `branch track` flags
- `-f, --force` — Skip prompts
- `-p, --parent` — Set parent branch

### `branch untrack` flags
- `-f, --force` — Skip confirmation

### `branch up` flags
- `-n, --steps <number>` — Number of levels to traverse
- `--to` — Target branch to navigate toward

---

## `changelog`

Show the Graphite CLI changelog.

---

## `commit` (`c`)

| Subcommand | Alias | Description |
|---|---|---|
| `commit amend` | `ca` | Amend the most recent commit and restack upstack branches. |
| `commit create` | `cc` | Create a new commit and restack upstack branches. |

### `commit amend` / `commit create` flags
- `-a, --all` — Stage all unstaged changes
- `-m, --message <text>` — Commit message
- `-n, --no-edit` — (amend only) Skip editing the message

---

## `completion`

Set up bash or zsh tab completion.

**Related:** `gt fish` — Set up fish shell tab completion.

---

## `continue` (`cont`)

Continue the most recent Graphite command halted by a merge conflict.

**Flags:**
- `-a, --all` — Stage all changes before continuing

---

## `dash` (`d`)

| Subcommand | Alias | Description |
|---|---|---|
| `dash` | `d` | Open the web dashboard. |
| `dash pr` | `dp` / `dpr` | Open the PR page for the current branch. |

### `gt pr` flags
- `--stack` — Open the stack page instead of single PR

---

## `docs`

Show the Graphite CLI docs.

---

## `downstack` (`ds`)

| Subcommand | Alias | Description |
|---|---|---|
| `downstack edit` | `dse` | Edit the order of the branches between trunk and the current branch, restacking all descendants. |
| `downstack get` | `dsg` | Get branches from trunk to the specified branch from remote, prompting to resolve conflicts. |
| `downstack restack` | `dsr` | From trunk to the current branch, ensure each is based on its parent, rebasing if necessary. |
| `downstack submit` | `dss` | Idempotently force push all branches from trunk to the current branch to GitHub, creating or updating PRs. |
| `downstack test` | `dst` | From trunk to the current branch, run the provided command on each branch and aggregate results. |
| `downstack track` | `dstr` | Track a series of untracked branches, specifying each branch's parent, stopping at a tracked branch. |

---

## `feedback`

| Subcommand | Description |
|---|---|
| `feedback [message]` | Post a string to the maintainers' Slack. |
| `feedback debug-context` | Print a debug summary of your repo (useful for bug reports). |

**Flags:**
- `-d, --with-debug-context` — Include 24-hour debug logs with message

---

## `log` (`l`)

| Subcommand | Alias | Description |
|---|---|---|
| `log` | `l` | Log all branches tracked by Graphite, showing dependencies and info. |
| `log short` | `ls` | Log all stacks tracked by Graphite, arranged to show dependencies. |
| `log long` | `ll` | Display a graph of the commit ancestry of all branches. |

**Flags (shared):**
- `-a, --all` — Show all configured trunk branches
- `--classic` — Use old display style
- `-r, --reverse` — Flip output order
- `-u, --show-untracked` — Include untracked branches
- `-s, --stack` — Show current stack only
- `-n, --steps` — Show limited number of levels
- `-t, --on-trunk` / `-b, --behind-trunk` — Filter relative to trunk

---

## `repo` (`r`)

| Subcommand | Alias | Description |
|---|---|---|
| `repo init` | `ri` | Create or regenerate a `.graphite_repo_config` file. |
| `repo name` | — | Show/set the current repo's name stored in Graphite. |
| `repo owner` | — | Show/set the current repo owner's name stored in Graphite. |
| `repo pr-templates` | — | List your GitHub PR templates (used to pre-fill PR bodies). |
| `repo remote` | — | Show/set the remote Graphite pushes to/pulls from (default: `origin`). |
| `repo sync` | `rs` | Pull trunk from remote and delete merged branches. |
| `repo trunk` | — | Show/set the trunk branch name. |
| `repo fix` | — | Search for and fix common repo problems. |
| `repo ignored-branches` | — | Manage glob patterns for ignored branches. |
| `repo max-branch-length` | — | Display/set maximum tracked commits per branch. |
| `repo max-days-behind-trunk` | — | Display/set maximum days behind trunk to track. |
| `repo max-stacks-behind-trunk` | — | Display/set maximum recent stacks to track. |

### `repo init` flags
- `--trunk <name>` — Specify trunk branch name
- `--ignore-branches <patterns>` — Set ignored branch glob patterns
- `--reset` — Untrack all branches

### `repo sync` flags
- `-f, --force` — Skip confirmations
- `--no-pull` — Skip pulling trunk
- `--no-delete` — Skip deleting merged branches
- `--show-delete-progress` — Show deletion progress
- `--restack` — Auto-restack unmerged branches after sync

### `repo ignored-branches` flags
- `--add <pattern>` — Add a glob pattern
- `--remove <pattern>` — Remove a glob pattern

### `repo [name|owner|remote|trunk]` flags
- `--set <value>` — Set the value

---

## `stack` (`s`)

| Subcommand | Alias | Description |
|---|---|---|
| `stack restack` | `sr` | Ensure each branch in the current stack is based on its parent, rebasing if necessary. |
| `stack submit` | `ss` | Idempotently force push all branches in the current stack to GitHub, creating or updating PRs. |
| `stack test` | `st` | Run the provided command on each branch in the current stack and aggregate results. |

---

## `upstack` (`us`)

| Subcommand | Alias | Description |
|---|---|---|
| `upstack onto [branch]` | `uso` | Rebase the current branch onto the latest commit of target branch and restack all descendants. |
| `upstack restack` | `usr` | Ensure the current branch and each of its descendants is based on its parent, rebasing if necessary. |
| `upstack submit` | `uss` | Idempotently force push the current branch and its descendants to GitHub, creating or updating PRs. |
| `upstack test` | `ust` | For each of the current branch and its descendants, run the provided command and aggregate results. |

---

## `submit` / `stack submit` / `upstack submit` / `downstack submit` flags

- `--ai` — Auto-generate PR title/description
- `--no-ai` — Disable AI generation
- `--always` — Push even if unchanged
- `--branch` — Specify which branch to target
- `--cli` — Edit PR metadata via CLI
- `--comment` — Add a PR comment
- `-c, --confirm` — Request confirmation before each push
- `-d, --draft` — Create PRs as drafts
- `-p, --publish` — Publish draft PRs
- `--dry-run` — Preview without pushing
- `-e, --edit` — Edit PR metadata before pushing
- `--edit-description` — Edit PR description
- `--edit-title` — Edit PR title
- `-n, --no-edit` — Skip all editing
- `-f, --force` — Force push
- `--ignore-out-of-sync-trunk` — Skip trunk sync check
- `-m, --merge-when-ready` — Auto-merge when CI passes and reviews approved
- `--rerequest-review` — Re-request review from existing reviewers
- `-r, --reviewers <list>` — Set PR reviewers
- `-t, --team-reviewers <list>` — Add team reviewers
- `-s, --stack` — Submit all descendants (when used from `gt submit`)
- `--target-trunk` — Override target trunk branch
- `-u, --update-only` — Only update existing PRs, don't create new ones
- `-v, --view` / `-w, --web` — Open PR in browser after submit

---

## `user` (`u`)

| Subcommand | Description |
|---|---|
| `user branch-date` | Toggle prepending date to auto-generated branch names. |
| `user branch-prefix` | The prefix Graphite prepends to generated branch names. |
| `user branch-replacement` | The character used to replace unsupported symbols in generated branch names. |
| `user editor` | The editor opened by Graphite for PR descriptions and text editing flows. |
| `user pager` | The pager used by Graphite. |
| `user restack-date` | Configure whether restack operations use author date. |
| `user submit-body` | Options for default PR description content. |
| `user tips` | Toggle tip display while using Graphite. |

### `user branch-date`
- `--enable` — Prepend date to generated branch names
- `--disable` — Disable date prepending

### `user branch-prefix`
- `--set <prefix>` — Set a custom prefix (e.g. your initials)
- `--reset` — Remove the prefix

### `user branch-replacement`
- `--set-underscore` — Replace unsupported chars with `_`
- `--set-dash` — Replace unsupported chars with `-` (recommended)
- `--set-empty` — Remove unsupported chars

### `user editor`
- `--set <editor>` — Set preferred editor (e.g. `vim`, `code --wait`)
- `--unset` — Revert to using the `git` editor

### `user pager`
- `--set <pager>` — Set preferred pager (e.g. `less -FRX`)
- `--unset` — Revert to using the `git` pager
- `--disable` — Disable paging entirely

### `user restack-date`
- `--use-author-date` — Use `--committer-date-is-author-date` during internal rebases
- `--no-use-author-date` — Disable author-date rebase behavior

### `user submit-body`
- `--include-commit-messages` — Include branch commit messages in PR body
- `--no-include-commit-messages` — Disable commit message inclusion

### `user tips`
- `--enable` — Show tips
- `--disable` — Hide tips

---

## Top-Level Shorthand Commands

| Command | Equivalent | Description |
|---|---|---|
| `gt absorb` | — | Amend staged changes into relevant downstack commits. |
| `gt abort` | — | Stop a halted Graphite command. |
| `gt add [args..]` | `git add` passthrough | Stage files. |
| `gt aliases` | — | Edit command aliases. |
| `gt bottom` | `gt branch bottom` | Switch to lowest branch in stack. |
| `gt checkout [branch]` | `gt branch checkout` | Switch branches interactively. |
| `gt cherry-pick [args..]` | `git cherry-pick` passthrough | Cherry-pick commits. |
| `gt children` | `gt branch children` | Show branch children. |
| `gt config` | — | Configure the CLI. |
| `gt create [name]` | `gt branch create` | Create new stacked branch. |
| `gt delete [name]` | `gt branch delete` | Delete a branch. |
| `gt demo [demoName]` | — | Run interactive tutorials (`"pull-request"` or `"stack"`). |
| `gt down [steps]` | `gt branch down` | Switch to parent branch. |
| `gt fold` | `gt branch fold` | Merge branch into parent. |
| `gt freeze [branch]` | — | Prevent local modifications to a branch. |
| `gt get [branch]` | — | Sync branches from remote to local. |
| `gt guide [title]` | — | Read extended guides. |
| `gt info [branch]` | `gt branch info` | Display branch information. |
| `gt init` | `gt repo init` | Initialize Graphite in repository. |
| `gt log [command]` | — | Display stacks (`long`, `short`, or default). |
| `gt merge` | — | Merge stack PRs. |
| `gt modify` | — | Amend current branch. |
| `gt move` | — | Rebase current branch onto a target branch. |
| `gt parent` | `gt branch parent` | Show branch parent. |
| `gt pop` | — | Delete branch but keep changes in working tree. |
| `gt pr [branch]` | — | Open PR page for branch. |
| `gt rebase [args..]` | `git rebase` passthrough | Run git rebase. |
| `gt rename [name]` | `gt branch rename` | Rename current branch. |
| `gt reorder` | — | Reorder branches in the current stack interactively. |
| `gt reset [args..]` | `git reset` passthrough | Run git reset. |
| `gt restack` | — | Ensure branches have correct parents. |
| `gt restore [args..]` | `git restore` passthrough | Run git restore. |
| `gt revert [sha]` | — | Create a revert branch. |
| `gt split` | `gt branch split` | Split current branch into multiple. |
| `gt squash` | `gt branch squash` | Squash commits into one. |
| `gt submit` | — | Force push and create/update PRs. |
| `gt sync` | — | Sync with remote. |
| `gt top` | `gt branch top` | Switch to tip of current stack. |
| `gt track [branch]` | `gt branch track` | Start tracking a branch. |
| `gt trunk` | — | Show branch trunk or manage trunk config. |
| `gt undo` | — | Undo the most recent Graphite mutation. |
| `gt unfreeze [branch]` | — | Re-enable local modifications to a branch. |
| `gt unlink [branch]` | — | Unlink the associated PR from a branch. |
| `gt untrack [branch]` | `gt branch untrack` | Stop tracking a branch. |
| `gt up [steps]` | `gt branch up` | Switch to child branch. |
| `gt upgrade` | — | Update to the latest CLI version. |

### `gt absorb` flags
- `-a, --all` — Stage all unstaged changes first
- `-d, --dry-run` — Preview without applying
- `-f, --force` — Skip confirmation
- `-p, --patch` — Pick hunks interactively

### `gt abort` flags
- `-f, --force` — Skip confirmation

### `gt get [branch]` flags
- `-d, --downstack` — Skip upstack sync (downstack only)
- `-f, --force` — Overwrite local with remote
- `--restack` — Auto-restack after get (default: true)
- `-U, --unfrozen` — Allow local edits after getting
- `-u, --remote-upstack` — Include remote upstack PRs

### `gt merge` flags
- `-c, --confirm` — Ask before merging each PR
- `--dry-run` — Preview without merging

### `gt modify` flags
- `-a, --all` — Stage all changes
- `-c, --commit` — Create a new commit (instead of amending)
- `-e, --edit` — Edit the commit message
- `--interactive-rebase` — Start interactive rebase
- `--into` — Amend into a specific downstack branch
- `-m, --message` — Specify commit message
- `-p, --patch` — Pick hunks interactively
- `--reset-author` — Update commit author
- `-u, --update` — Stage tracked file updates
- `-v, --verbose` — Show diff

### `gt move` flags
- `-a, --all` — Show all configured trunks
- `-o, --onto` — Target branch to move onto
- `--source` — Branch to move (defaults to current)

### `gt restack` flags
- `--branch` — Which branch to restack
- `--downstack` — Restack ancestors only
- `--only` — Restack single branch only (no descendants)
- `--upstack` — Restack descendants only

### `gt revert` flags
- `-e, --edit` — Edit the revert commit message

### `gt sync` flags
- `-f, --force` — Skip confirmations
- `--no-pull` — Skip pulling trunk
- `--no-delete` — Skip deleting merged branches
- `--show-delete-progress` — Show deletion progress
- `--restack` — Auto-restack after sync

### `gt trunk` flags
- `--add` — Add an additional trunk branch
- `-a, --all` — Show all configured trunk branches

### `gt undo` flags
- `-f, --force` — Skip confirmation

---

## Shorthand Cheat Sheet

```
# Creating and updating
gt create / gt cr      gt branch create
gt cc                  gt commit create
gt ca                  gt commit amend
gt modify              amend current branch

# Navigating
gt up / gt u           switch to child branch
gt down / gt d         switch to parent branch
gt top / gt t          switch to tip of stack
gt bottom              switch to base of stack
gt checkout / gt co    interactive branch switch
gt parent              print parent branch name

# Stack operations
gt stack restack       sr    rebase whole stack
gt stack submit        ss    submit whole stack
gt upstack restack     usr   rebase current + descendants
gt upstack submit      uss   submit current + descendants
gt upstack onto        uso   rebase onto target branch
gt downstack restack   dsr   rebase trunk → current
gt downstack submit    dss   submit trunk → current
gt downstack edit      dse   reorder branches

# Syncing
gt sync                pull trunk, delete merged branches
gt repo sync / rs      same via repo subcommand
gt get                 fetch branches from remote

# Logging
gt log / gt l          full stack log
gt log short / ls      compact stack log
gt log long / ll       commit ancestry graph

# PR management
gt submit              force push + create/update PRs
gt merge               merge stack PRs
gt pr                  open PR in browser
gt dash / gt d         open web dashboard

# Branch management
gt fold                merge branch into parent
gt split               split branch into multiple
gt squash              squash commits
gt rename              rename branch
gt delete              delete branch
gt track / gt tr       start tracking a branch
gt untrack / gt utr    stop tracking a branch
gt undo                undo last Graphite mutation
```
