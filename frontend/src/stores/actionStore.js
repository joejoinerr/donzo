import { defineStore } from 'pinia';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '@/db';

export const useActionStore = defineStore('actions', () => {
    const isNotDeleted = (item) => !item.deleted;

    const inboxActions = useObservable(
        liveQuery(() => db.actions.where('state').equals('inbox').filter(isNotDeleted).toArray())
    );

    const nextActions = useObservable(
        liveQuery(() => db.actions.where('state').equals('next').filter(isNotDeleted).toArray())
    );

    const waitingActions = useObservable(
        liveQuery(() => db.actions.where('state').equals('waiting').filter(isNotDeleted).toArray())
    );

    const somedayActions = useObservable(
        liveQuery(() => db.actions.where('state').equals('someday').filter(isNotDeleted).toArray())
    );

    const projects = useObservable(
        liveQuery(() => db.projects.filter(isNotDeleted).toArray())
    );

    const projectActions = useObservable(
        liveQuery(() => db.actions.where('projectLid').notEqual(null).filter(isNotDeleted).toArray())
    );

    return {
        inboxActions,
        nextActions,
        waitingActions,
        somedayActions,
        projects,
        projectActions,
    };
});