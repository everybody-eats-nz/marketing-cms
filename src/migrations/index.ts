import * as migration_20260609_234426_initial from './20260609_234426_initial';

export const migrations = [
  {
    up: migration_20260609_234426_initial.up,
    down: migration_20260609_234426_initial.down,
    name: '20260609_234426_initial'
  },
];
