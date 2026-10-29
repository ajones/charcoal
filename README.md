# Charcoal

> A CLI for managing stacked branches and pull requests

Charcoal is an open source fork of the Graphite CLI. It runs on plain git and needs no Graphite account or API. The binary is `gt`.

## Install

Charcoal installs from source. You need Node 18.17.1 (see `.nvmrc`), yarn, and turbo.

```bash
nvm use
npm install -g yarn turbo
yarn install
cd apps/cli && yarn dev
```

`yarn dev` builds the CLI and links `gt` (and `graphite`) globally with npm. Run it again after you pull new changes.

To run the CLI without the global link, use `yarn cli <command>` in `apps/cli`.

## Quick start

```bash
cd my-repo
gt init                     # pick the trunk branch (e.g. main)

# Make a stack of branches
git add -A && gt create -m "feat: add api"
git add -A && gt create -m "feat: add ui"

gt log                      # show the stack
gt down / gt up             # move through the stack
gt modify -a                # amend the current branch, restack its children
gt restack                  # rebase each branch onto its parent

gt sync                     # pull trunk, delete merged branches
```

## Concepts

- **Trunk**: the base branch of every stack (for example `main`). Set it with `gt init` or `gt repo trunk`.
- **Stack**: a chain of branches. Each branch has one parent.
- **Tracked branch**: a branch that Charcoal has parent metadata for. Use `gt track` to add an existing branch.
- **Upstack / downstack**: the descendants / ancestors of the current branch.
- **Restack**: rebase a branch onto the tip of its parent. Most commands that change a branch restack its children for you.

Charcoal keeps its metadata in `.git/`. User settings live in `~/.graphite/`.

## Command surface

Run `gt <command> --help` for the full flags of a command. Aliases are in parentheses. A group alias and a subcommand alias join into one word: `gt ss` is `gt stack submit`, and `gt dsr` is `gt downstack restack`.

### Create and change branches

| Command | Description |
|---|---|
| `gt create [name]` (`cr`) | Create a branch on top of the current branch and commit staged changes. With `-m` and no name, the name comes from the message. Flags: `-a` stage all, `-p` pick hunks, `-i` insert between the current branch and its children. |
| `gt modify` (`m`) | Amend the last commit and restack upstack branches. Flags: `-a`, `-p`, `-m`, `--edit`, `-n`. |
| `gt squash` (`sq`) | Squash all commits in the current branch and restack upstack. |
| `gt split` (`sp`) | Split the current branch into more branches, by commit (`-c`) or by hunk (`-h`). |
| `gt fold` (`fo`) | Fold the current branch into its parent and restack. `-k` keeps the current branch name. |
| `gt move [branch]` (`mv`) | Move the current branch (or `--source`) onto a new parent and restack it and its descendants. |
| `gt rename [name]` (`rn`) | Rename a branch and update its metadata. |
| `gt delete [name]` (`dl`) | Delete a branch and its metadata. `-f` deletes an unmerged branch. |
| `gt pop` (`po`) | Delete the current branch and keep its changes unstaged in the working tree. |
| `gt restack` (`rs`) | Rebase each branch in the current stack onto its parent, as necessary. |
| `gt continue` (`cont`) | Continue the last command after you resolve a merge conflict. `-a` stages all changes first. |

### Navigate

| Command | Description |
|---|---|
| `gt up [steps]` (`u`) | Go to a child branch. Prompts if there is more than one. |
| `gt down [steps]` (`d`) | Go to the parent branch. |
| `gt top` (`t`) | Go to the tip of the current stack. |
| `gt bottom` (`b`, `bot`) | Go to the first branch above trunk. |
| `gt trunk` (`tk`) | Go to the trunk branch. |
| `gt checkout [branch]` / `gt co` | Go to a branch. With no branch, opens a selector. `-u` includes untracked branches. |
| `gt parent` (`par`) | Print the parent of the current branch. |
| `gt children` (`ch`) | Print the children of the current branch. |

### Inspect

| Command | Description |
|---|---|
| `gt log` (`l`) | Show all tracked branches and their dependencies. Flags: `-s` current stack only, `-n` levels, `-r` reverse, `-u` untracked. |
| `gt log short` (`ls`) | Show a compact view of the stacks. |
| `gt log long` (`ll`) | Show a graph of the commit ancestry of all branches. |
| `gt info` (`i`) | Show data about the current branch. Flags: `-d` diff, `-p` patch, `-b` PR body. |
| `gt diff [args..]` (`df`) | Show the diff between the current branch and its parent. `-s` diffs the full stack against trunk. Other arguments go to `git diff`. |

### Track branches

| Command | Description |
|---|---|
| `gt track [branch]` (`tr`) | Track a branch and select its parent. `-p` sets the parent, `-f` uses the nearest tracked ancestor. Also repairs bad metadata. |
| `gt untrack [branch]` (`utr`) | Stop tracking a branch and its children. |
| `gt downstack track [branch]` (`dstr`) | Track a chain of untracked branches down to a tracked branch. |

### Sync and submit

| Command | Description |
|---|---|
| `gt sync` (`sy`) | Pull trunk from the remote and delete merged branches. Flags: `--no-pull`, `--no-delete`, `-f`. |
| `gt downstack get [branch]` (`dsg`) | Get branches from trunk to the given branch from the remote. |
| `gt branch submit` (`bs`) | Push the current branch and create or update its GitHub PR. |
| `gt stack submit` (`ss`) | Push each branch in the current stack and create or update its PR. |
| `gt upstack submit` (`uss`) | Push the current branch and its descendants. |
| `gt downstack submit` (`dss`) | Push the branches from trunk to the current branch. |
| `gt auth` | Authenticate with GitHub so submit can manage PRs. |

Submit flags: `-d` draft, `-p` publish, `-e` / `-n` edit or skip PR fields, `-r` reviewers, `--dry-run`, `-c` confirm, `-s` select, `-u` update only, `-f` force push, `--always`.

### Command groups

The top-level commands above are shortcuts. The full set is in these groups:

| Group | Subcommands |
|---|---|
| `gt branch` | `bottom`, `checkout`, `create`, `delete`, `down`, `edit`, `fold`, `info`, `rename`, `restack`, `split`, `squash`, `submit`, `top`, `track`, `unbranch`, `untrack`, `up` |
| `gt commit` (`c`) | `create`, `amend` |
| `gt stack` (`s`) | `restack`, `submit`, `test <command>` |
| `gt upstack` (`us`) | `onto [branch]`, `restack`, `submit`, `test <command>` |
| `gt downstack` (`ds`) | `edit`, `get`, `restack`, `submit`, `test <command>`, `track` |
| `gt log` (`l`) | (default), `short`, `long` |
| `gt repo` (`r`) | `init`, `trunk`, `remote`, `sync`, `name`, `owner`, `pr-templates`, `github` |
| `gt user` | `branch-date`, `branch-prefix`, `branch-replacement`, `editor`, `pager`, `restack-date`, `submit-body`, `tips` |
| `gt feedback` | `debug-context` |

Some useful group commands:

- `gt branch edit`: run an interactive rebase on the current branch, then restack upstack.
- `gt branch unbranch`: delete the current branch but keep the files in the working tree.
- `gt upstack onto [branch]`: rebase the current branch onto another branch and restack its descendants.
- `gt downstack edit`: change the order of the branches between trunk and the current branch.
- `gt stack test "<cmd>"`: run a command on each branch in the stack and show the results.

### Setup and config

| Command | Description |
|---|---|
| `gt init` | Create or regenerate the repo config. `--trunk` sets the trunk, `--reset` untracks all branches. |
| `gt repo trunk --set <branch>` | Show or set the trunk branch. |
| `gt repo remote --set <remote>` | Show or set the remote (default `origin`). |
| `gt user editor --set <editor>` | Set the editor that Charcoal opens. |
| `gt user pager --set <pager>` | Set the pager, or `--disable` it. |
| `gt completion` | Set up bash or zsh tab completion. |
| `gt fish` | Set up fish tab completion. |

### Global flags

| Flag | Description |
|---|---|
| `-h, --help` | Show help for a command. |
| `--no-interactive` | Do not prompt. |
| `--no-verify` | Do not run git hooks. |
| `-q, --quiet` | Show less output. |
| `--debug` | Show debug output. |

## History

On 7/14/2023, Graphite closed open source development of the Graphite CLI. [danerwilliams/charcoal](https://github.com/danerwilliams/charcoal) continued the open source version. This repo is a fork of that project. The goal is a stack tool that works on git only, with no specific git provider. See [REMAINING_GAPS.md](./REMAINING_GAPS.md) for the work that remains.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [AGENTS.md](./AGENTS.md).
