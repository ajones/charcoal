import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import prompts from 'prompts';
import { createBranchAction } from '../../src/actions/create_branch';
import { BasicScene } from '../lib/scenes/basic_scene';
import { configureTest } from '../lib/utils/configure_test';

use(chaiAsPromised);

const scene = new BasicScene();
describe(`(${scene}): create branch action`, function () {
  configureTest(this, scene);

  it('creates an empty branch after confirmation when there are no staged changes', async () => {
    const context = scene.getContext(true);
    prompts.inject([true]);

    await createBranchAction({ branchName: 'a' }, context);

    expect(scene.repo.currentBranchName()).to.equal('a');
    expect(scene.repo.listCurrentBranchCommitMessages()).to.deep.equal(['1']);
  });

  it('rolls back branch creation when the user declines creating an empty branch', async () => {
    const context = scene.getContext(true);
    prompts.inject([false]);

    await expect(
      createBranchAction({ branchName: 'a' }, context)
    ).to.be.rejected;

    expect(scene.repo.currentBranchName()).to.equal('main');
    expect(scene.repo.getRef('refs/heads/a')).to.equal('');
  });

  it('aborts in non-interactive mode when there are no staged changes', async () => {
    const context = scene.getContext(false);

    await expect(
      createBranchAction({ branchName: 'a' }, context)
    ).to.be.rejectedWith(
      'No staged changes; aborting non-interactive branch creation.'
    );

    expect(scene.repo.currentBranchName()).to.equal('main');
    expect(scene.repo.getRef('refs/heads/a')).to.equal('');
  });
});
