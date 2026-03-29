import chalk from 'chalk';
import { TContext } from '../lib/context';
import { ExitFailedError } from '../lib/errors';
import { getDiff } from '../lib/git/diff';
import { runGitCommand } from '../lib/git/runner';
import { uncommittedTrackedChangesPrecondition } from '../lib/preconditions';

export function popBranchAction(context: TContext): void {
  uncommittedTrackedChangesPrecondition();

  const current = context.engine.currentBranchPrecondition;

  if (context.engine.isTrunk(current)) {
    throw new ExitFailedError('Cannot pop trunk.');
  }

  if (!context.engine.isBranchTracked(current)) {
    throw new ExitFailedError(`${current} is not tracked by Charcoal.`);
  }

  const children = context.engine.getChildren(current);
  if (children.length > 0) {
    throw new ExitFailedError(
      `Cannot pop a branch with children (${children.join(
        ', '
      )}). Use \`gt fold\` or remove child branches first.`
    );
  }

  const parent = context.engine.getParentPrecondition(current);
  const diff = getDiff(parent, current);

  context.engine.checkoutBranch(parent);

  if (diff) {
    runGitCommand({
      args: ['apply'],
      options: { input: diff },
      onError: 'throw',
      resource: 'popApplyPatch',
    });
    context.splog.info(
      `Changes from ${chalk.red(current)} left unstaged in working tree.`
    );
  }

  context.engine.deleteBranch(current);
  context.splog.info(
    `Deleted ${chalk.red(current)}, now on ${chalk.cyan(parent)}.`
  );
}
