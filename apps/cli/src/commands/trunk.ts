import yargs from 'yargs';
import { graphite } from '../lib/runner';

const args = {} as const;
type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'trunk';
export const canonical = 'trunk';
export const aliases = ['tk'];
export const description = 'Switch to the trunk branch.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> => {
  return graphite(argv, canonical, async (context) => {
    context.engine.checkoutBranch(context.engine.trunk);
  });
};
