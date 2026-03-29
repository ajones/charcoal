import yargs from 'yargs';
import { graphite } from '../lib/runner';

const args = {} as const;
type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'children';
export const canonical = 'children';
export const aliases = ['ch'];
export const description = 'Print the child branches of the current branch.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => {
    const children = context.engine.getChildren(
      context.engine.currentBranchPrecondition
    );
    children.forEach((child) => {
      // eslint-disable-next-line no-console
      console.log(child);
    });
  });
