import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  ignores: [
    (commitMessage) => commitMessage.startsWith('FEAT'),
    (commitMessage) => commitMessage.startsWith('FIX'),
    (commitMessage) => commitMessage.startsWith('Updated'),
  ],
};

export default Configuration;
