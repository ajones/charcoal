import yargs from 'yargs';
import { popBranchAction } from '../actions/pop';
import { graphite } from '../lib/runner';

const args = {} as const;
type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'pop';
export const canonical = 'pop';
export const aliases = ['po'];
export const description =
  'Delete the current branch and leave its changes unstaged in the working tree.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => popBranchAction(context));
