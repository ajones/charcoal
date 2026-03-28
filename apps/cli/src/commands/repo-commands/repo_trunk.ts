import yargs from 'yargs';
import { graphite } from '../../lib/runner';

const args = {
  set: {
    optional: false,
    type: 'string',
    alias: 's',
    describe: 'Override the name of the trunk branch.',
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'trunk';
export const canonical = 'repo trunk';
export const description = 'Show or set the trunk branch for this repository.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> => {
  return graphite(argv, canonical, async (context) => {
    if (argv.set) {
      context.repoConfig.setTrunk(argv.set);
      context.splog.info(`Trunk set to ${argv.set}.`);
    } else {
      // eslint-disable-next-line no-console
      console.log(context.engine.trunk);
    }
  });
};
