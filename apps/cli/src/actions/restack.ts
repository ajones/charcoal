import chalk from 'chalk';
import { TContext } from '../lib/context';
import { RebaseConflictError } from '../lib/errors';
import { stashPop, stashSave } from '../lib/git/stash';
import { assertUnreachable } from '../lib/utils/assert_unreachable';
import { persistContinuation } from './persist_continuation';
import { printConflictStatus } from './print_conflict_status';

export function restackBranches(
  branchNames: string[],
  context: TContext
): void {
  const stashed = stashSave();
  if (stashed) {
    context.splog.info('Stashed uncommitted changes.');
  }
  try {
    restackBranchesInner(branchNames, context);
  } finally {
    if (stashed) {
      stashPop();
      context.splog.info('Restored stashed changes.');
    }
  }
}

function restackBranchesInner(branchNames: string[], context: TContext): void {
  context.splog.debug(
    branchNames.reduce((acc, curr) => `${acc}\n${curr}`, 'RESTACKING:')
  );
  while (branchNames.length > 0) {
    const branchName = branchNames.shift() as string;

    if (context.engine.isTrunk(branchName)) {
      context.splog.info(
        `${chalk.cyan(branchName)} does not need to be restacked.`
      );
      continue;
    }

    const result = context.engine.restackBranch(branchName);
    context.splog.debug(`${result}: ${branchName}`);
    switch (result.result) {
      case 'REBASE_DONE':
        context.splog.info(
          `Restacked ${chalk.green(branchName)} on ${chalk.cyan(
            context.engine.getParentPrecondition(branchName)
          )}.`
        );
        continue;

      case 'REBASE_CONFLICT':
        persistContinuation(
          {
            branchesToRestack: branchNames,
            rebasedBranchBase: result.rebasedBranchBase,
          },
          context
        );
        printConflictStatus(
          `Hit conflict restacking ${chalk.yellow(branchName)} on ${chalk.cyan(
            context.engine.getParentPrecondition(branchName)
          )}.`,
          context
        );
        throw new RebaseConflictError();

      case 'REBASE_UNNEEDED':
        context.splog.info(
          `${chalk.cyan(
            branchName
          )} does not need to be restacked${` on ${chalk.cyan(
            context.engine.getParentPrecondition(branchName)
          )}`}.`
        );
        continue;

      default:
        assertUnreachable(result);
    }
  }
}
