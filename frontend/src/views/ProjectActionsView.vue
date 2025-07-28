<template>
    <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
        <ItemCheckbox :due-date="project ? project.due : null" :completed="project ? project.completed : null"
            @check="toggleCompleteProject()" />
        <button class="cursor-pointer" @click="modalStore.openEdit(project)">
            <h1 class="inline-block text-lg font-bold text-gray-600 hover:underline">{{ project?.title || 'Loading...'
                }}</h1>
        </button>
    </div>
    <div v-if="nextActionsList.length > 0" class="not-last:mb-8">
        <h2 class="mb-3 font-bold text-gray-600">Next</h2>
        <ol>
            <ActionListItem v-for="action in nextActionsList" :key="action.lid" :action="action" />
        </ol>
    </div>
    <div v-if="somedayActionsList.length > 0" class="not-last:mb-8">
        <h2 class="mb-3 font-bold text-gray-600">Someday</h2>
        <ol>
            <ActionListItem v-for="action in somedayActionsList" :key="action.lid" :action="action" />
        </ol>
    </div>
    <div v-if="completedActionsList.length > 0">
        <h2 class="mb-3 font-bold text-gray-600">Done</h2>
        <ol>
            <ActionListItem v-for="action in completedActionsList" :key="action.lid" :action="action" />
        </ol>
    </div>
    <div v-if="!actionsCount" class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useProjectModalStore } from '@/stores/modalStore';
import ItemCheckbox from '@/components/ItemCheckbox.vue';

const modalStore = useProjectModalStore();
const route = useRoute();
const projectLid = Number(route.params.projectLid);

const actionsList = useObservable(
    liveQuery(async () =>
        await db.actions
            .filter(action => !action.deleted && action.projectLid === projectLid)
            .toArray()
    )
)
const actionsCount = computed(() => actionsList.value ? actionsList.value.length : 0);
const nextActionsList = computed(() => actionsList.value ? actionsList.value.filter(a => !a.completed && a.state === 'next') : []);
const somedayActionsList = computed(() => actionsList.value ? actionsList.value.filter(a => !a.completed && a.state === 'someday') : []);
const completedActionsList = computed(() => actionsList.value ? actionsList.value.filter(a => a.completed) : []);

const project = useObservable(
    liveQuery(async () => await db.projects.get(projectLid))
)

async function toggleCompleteProject() {
    const newCompletedState = !project.value.completed;
    await db.projects.update(project.value.lid, { completed: newCompletedState });
    // If the project is being marked as completed, mark all its actions as completed
    if (newCompletedState) {
        await db.actions.filter(action => action.projectLid === project.value.lid && !action.completed)
            .modify({ completed: true });
    }
}
</script>
