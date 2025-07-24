import Dexie from 'dexie';

export const db = new Dexie('donzo');
db.version(1).stores({
  actions: '++lid, id, title, completed', // Primary key and indexed props
});
