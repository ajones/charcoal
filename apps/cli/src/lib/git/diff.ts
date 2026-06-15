import { spawnSync } from 'child_process';
import { runGitCommand } from './runner';

export function detectStagedChanges(): boolean {
  return (
    runGitCommand({
      args: [`--no-pager`, `diff`, `--no-ext-diff`, `--shortstat`, `--cached`],
      onError: 'throw',
      resource: 'detectStagedChanges',
    }).length > 0
  );
}

export function getUnstagedChanges(): string {
  return runGitCommand({
    args: [
      `-c`,
      `color.ui=always`,
      `--no-pager`,
      `diff`,
      `--no-ext-diff`,
      `--stat`,
    ],
    onError: 'throw',
    resource: 'getUnstagedChanges',
  });
}

export function showDiff(left: string, right: string): string {
  return runGitCommand({
    args: [
      `-c`,
      `color.ui=always`,
      `--no-pager`,
      `diff`,
      `--no-ext-diff`,
      left,
      right,
      `--`,
    ],
    onError: 'throw',
    resource: 'showDiff',
  });
}

export function isDiffEmpty(left: string, right: string): boolean {
  return (
    runGitCommand({
      args: [
        `--no-pager`,
        `diff`,
        `--no-ext-diff`,
        `--shortstat`,
        left,
        right,
        `--`,
      ],
      onError: 'throw',
      resource: 'isDiffEmpty',
    }).length === 0
  );
}

export function getDiff(left: string, right: string | undefined): string {
  return runGitCommand({
    args: ['diff', left, ...(right ? [right] : []), '--no-prefix', '--unified'],
    onError: 'throw',
    resource: 'getDiff',
  });
}

// Pass arbitrary arguments straight through to `git diff`, inheriting stdio so
// the user gets git's native pager, coloring, and exit code.
export function forwardGitDiff(args: string[]): void {
  const result = spawnSync('git', ['diff', ...args], {
    stdio: 'inherit',
    windowsHide: true,
  });
  if (result.error) {
    throw result.error;
  }
  // eslint-disable-next-line no-restricted-syntax
  process.exitCode = result.status ?? 0;
}
