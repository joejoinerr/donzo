import Dexie from 'dexie';

export const db = new Dexie('donzo');
db.version(1).stores({
  actions: '++lid, completed, state, projectLid', // Primary key and indexed props
  projects: '++lid, completed, state', // Primary key and indexed props
});
