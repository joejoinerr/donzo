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
        liveQuery(async () => {
            const projectsData = await db.projects.filter(isNotDeleted).toArray();
            const actionsData = await db.actions.where('projectLid').notEqual(null).filter(isNotDeleted).toArray();
            
            // Create a map of project IDs to action counts
            const actionCounts = actionsData.reduce((acc, action) => {
                acc[action.projectLid] = (acc[action.projectLid] || 0) + 1;
                return acc;
            }, {});
            
            // Add action count to each project
            return projectsData.map(project => ({
                ...project,
                actionCount: actionCounts[project.lid] || 0
            }));
        })
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
