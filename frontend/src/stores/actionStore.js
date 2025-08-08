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

    const deletedActions = useObservable(
        liveQuery(() => db.actions.filter(item => item.deleted).toArray())
    );

    const projects = useObservable(
        liveQuery(() => 
            Promise.all([
                db.projects.filter(isNotDeleted).toArray(),
                // Filter for actions that are associated with projects
                db.actions.filter((a) => a.projectLid).filter(isNotDeleted).toArray()
            ]).then(([projectsData, actionsData]) => {
                // Group actions by project ID
                const actionsByProject = actionsData.reduce((accumulator, action) => {
                    if (!accumulator[action.projectLid]) {
                        accumulator[action.projectLid] = [];
                    }
                    accumulator[action.projectLid].push(action);
                    return accumulator;
                }, {});
                
                // Add actions array to each project
                return projectsData.map(project => ({
                    ...project,
                    actions: actionsByProject[project.lid] || []
                }));
            })
        )
    );

    const tags = useObservable(
        liveQuery(() => db.tags.filter(isNotDeleted).toArray())
    );

    return {
        inboxActions,
        nextActions,
        waitingActions,
        somedayActions,
        projects,
        deletedActions,
        tags,
    };
});
