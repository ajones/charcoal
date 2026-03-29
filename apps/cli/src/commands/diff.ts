import yargs from 'yargs';
import { graphite } from '../lib/runner';

const args = {
  stack: {
    describe: `Show the diff for the entire current stack against trunk.`,
    demandOption: false,
    default: false,
    type: 'boolean',
    alias: 's',
  },
} as const;
type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'diff';
export const canonical = 'diff';
export const aliases = ['df'];
export const description =
  'Show the diff between the current branch and its parent. Use --stack to diff the entire stack against trunk.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    const current = context.engine.currentBranchPrecondition;
    const output = argv.stack
      ? context.engine.getStackDiff(current)
      : context.engine.getDiff(
          context.engine.getParentPrecondition(current),
          current
        );
    context.splog.page(output);
  });
