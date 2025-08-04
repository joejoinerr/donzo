import { defineStore } from 'pinia';
import { useObservable } from '@vueuse/rxjs';
import { computed } from 'vue';
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

    const projectData = useObservable(
        liveQuery(async () => {
            const projectsData = await db.projects.filter(isNotDeleted).toArray();
            const actionsData = await db.actions.where('projectLid').notEqual(null).filter(isNotDeleted).toArray();
            
            // Create a map of project IDs to action counts
            const actionCounts = actionsData.reduce((accumulator, action) => {
                accumulator[action.projectLid] = (accumulator[action.projectLid] || 0) + 1;
                return accumulator;
            }, {});
            
            // Add action count to each project
            const projectsWithCounts = projectsData.map(project => ({
                ...project,
                actionCount: actionCounts[project.lid] || 0
            }));
            
            return {
                projects: projectsWithCounts,
                actions: actionsData
            };
        })
    );

    const projects = computed(() => projectData.value?.projects || []);
    const projectActions = computed(() => projectData.value?.actions || []);

    return {
        inboxActions,
        nextActions,
        waitingActions,
        somedayActions,
        projects,
        projectActions,
    };
});
