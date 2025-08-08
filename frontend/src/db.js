import Dexie from 'dexie';

export const db = new Dexie('donzo');
db.version(1).stores({
  actions: '++lid, state, projectLid', // Primary key and indexed props
  projects: '++lid, state', // Primary key and indexed props
  tags: '++lid, type',
});
