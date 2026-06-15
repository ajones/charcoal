import yargs from 'yargs';
import { graphite } from '../lib/runner';

const args = {
  args: {
    describe: `Arguments passed straight through to \`git diff\` (e.g. a ref, path, or flag like --staged).`,
    type: 'string',
    array: true,
    default: [] as string[],
  },
  stack: {
    describe: `Show the diff for the entire current stack against trunk.`,
    demandOption: false,
    default: false,
    type: 'boolean',
    alias: 's',
  },
} as const;
type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'diff [args..]';
export const canonical = 'diff';
export const aliases = ['df'];
export const description =
  'Show the diff between the current branch and its parent. Use --stack to diff the entire stack against trunk. Any additional arguments are passed through to `git diff`.';
export const builder = (yargs: yargs.Argv): yargs.Argv =>
  yargs.options(args).parserConfiguration({
    'unknown-options-as-args': true,
    'halt-at-non-option': true,
  });

export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    // Anything the user passes beyond the gt-specific `--stack` flag is
    // forwarded verbatim to `git diff`. `--`-separated paths land in `_`
    // (after the command name) rather than in the variadic positional.
    const forwardedPaths = argv._.slice(1).map(String);
    const forwardedArgs = [
      ...argv.args,
      ...(forwardedPaths.length ? ['--', ...forwardedPaths] : []),
    ];

    if (forwardedArgs.length) {
      context.engine.forwardDiff(forwardedArgs);
      return;
    }

    const current = context.engine.currentBranchPrecondition;
    const output = argv.stack
      ? context.engine.getStackDiff(current)
      : context.engine.getDiff(
          context.engine.getParentPrecondition(current),
          current
        );
    context.splog.page(output);
  });
