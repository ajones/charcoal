export { builder, handler } from './upstack-commands/onto';

export const command = 'move [branch]';
export const canonical = 'move';
export const aliases = ['mv'];
export const description =
  'Move the current branch onto a new parent and restack it and its descendants. If no branch is passed in, opens an interactive selector.';
