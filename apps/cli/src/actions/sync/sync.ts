import chalk from 'chalk';
import { TContext } from '../../lib/context';
import { KilledError } from '../../lib/errors';
import { stashPop, stashSave } from '../../lib/git/stash';
import { cleanBranches } from './clean_branches';
import { syncPrInfo } from '../sync_pr_info';

export async function syncAction(
  opts: {
    pull: boolean;
    force: boolean;
    delete: boolean;
    showDeleteProgress: boolean;
  },
  context: TContext
): Promise<void> {
  if (opts.pull) {
    await pullTrunk(opts.force, context);
    context.splog.tip('You can skip pulling trunk with the `--no-pull` flag.');
  }

  await syncPrInfo(context.engine.allBranchNames, context);

  if (opts.delete) {
    context.splog.info(
      `🧹 Checking if any branches have been merged/closed and can be deleted...`
    );
    await cleanBranches(
      { showDeleteProgress: opts.showDeleteProgress, force: opts.force },
      context
    );
    context.splog.tip(
      [
        'You can skip deleting branches with the `--no-delete` flag.',
        ...(opts.force
          ? []
          : [
              'Try the `--force` flag to delete merged branches without prompting for each.',
            ]),
      ].join('\n')
    );
  }

  restackAllBestEffort(context);
}

function restackAllBestEffort(context: TContext): void {
  context.splog.info(`🔄 Restacking all tracked branches...`);
  const stashed = stashSave();
  if (stashed) {
    context.splog.info('Stashed uncommitted changes.');
  }
  try {
    restackAllBestEffortInner(context);
  } finally {
    if (stashed) {
      stashPop();
      context.splog.info('Restored stashed changes.');
    }
  }
}

function restackAllBestEffortInner(context: TContext): void {
  const allTracked = context.engine.allBranchNames.filter(
    (b) => context.engine.isBranchTracked(b) && !context.engine.isTrunk(b)
  );

  let restacked = 0;
  let skipped = 0;

  for (const branchName of allTracked) {
    const result = context.engine.restackBranch(branchName);
    if (result.result === 'REBASE_CONFLICT') {
      context.engine.abortRebase();
      context.splog.warn(
        `Skipped ${chalk.yellow(branchName)} — conflict during restack.`
      );
      skipped++;
    } else if (result.result === 'REBASE_DONE') {
      context.splog.info(
        `Restacked ${chalk.green(branchName)} on ${chalk.cyan(
          context.engine.getParentPrecondition(branchName)
        )}.`
      );
      restacked++;
    }
  }

  if (skipped > 0) {
    context.splog.tip(
      `${skipped} branch(es) skipped due to conflicts. Run \`gt restack\` on each to resolve.`
    );
  }
  if (restacked === 0 && skipped === 0) {
    context.splog.info('All branches are up to date.');
  }
}

export async function pullTrunk(
  force: boolean,
  context: TContext
): Promise<void> {
  context.splog.info(
    `🌲 Pulling ${chalk.cyan(context.engine.trunk)} from remote...`
  );
  const pullResult = context.engine.pullTrunk();
  if (pullResult !== 'PULL_CONFLICT') {
    context.splog.info(
      pullResult === 'PULL_UNNEEDED'
        ? `${chalk.green(context.engine.trunk)} is up to date.`
        : `${chalk.green(context.engine.trunk)} fast-forwarded to ${chalk.gray(
            context.engine.getRevision(context.engine.trunk)
          )}.`
    );
    return;
  }

  // If trunk cannot be fast-forwarded, prompt the user to reset to remote
  context.splog.warn(
    `${chalk.blueBright(context.engine.trunk)} could not be fast-forwarded.`
  );
  if (
    force ||
    (context.interactive &&
      (
        await context.prompts({
          type: 'confirm',
          name: 'value',
          message: `Overwrite ${chalk.yellow(
            context.engine.trunk
          )} with the version from remote?`,
          initial: true,
        })
      ).value)
  ) {
    context.engine.resetTrunkToRemote();
    context.splog.info(
      `${chalk.green(context.engine.trunk)} set to ${chalk.gray(
        context.engine.getRevision(context.engine.trunk)
      )}.`
    );
  } else {
    throw new KilledError();
  }
}
