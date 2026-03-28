import { runGitCommand } from './runner';

export function stashSave(): boolean {
  const output = runGitCommand({
    args: ['stash', 'push', '--include-untracked', '--message', 'gt-autostash'],
    onError: 'throw',
    resource: 'stashSave',
  });
  return !output.includes('No local changes to save');
}

export function stashPop(): void {
  runGitCommand({
    args: ['stash', 'pop'],
    onError: 'throw',
    resource: 'stashPop',
  });
}
