<template>
    <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
        <ItemCheckbox :due-date="project ? project.due : null" :completed="project ? project.completed : null"
            @check="toggleCompleteProject()" />
        <button class="cursor-pointer" @click="modalStore.openEdit(project)">
            <h1 class="inline-block leading-none text-lg font-bold text-gray-600 hover:underline">{{ project?.title ||
                'Loading...'
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
    <div v-if="!project.actions.length" class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { db } from '../db';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useProjectModalStore } from '@/stores/modalStore';
import ItemCheckbox from '@/components/ItemCheckbox.vue';
import { storeToRefs } from 'pinia';
import { useActionStore } from '@/stores/actionStore';

const modalStore = useProjectModalStore();
const route = useRoute();
const projectLid = Number(route.params.projectLid);

const { projects } = storeToRefs(useActionStore());
const project = computed(() => projects.value?.find(p => p.lid === projectLid));
const nextActionsList = computed(() => project.value ? project.value.actions.filter(a => !a.completed && a.state === 'next') : []);
const somedayActionsList = computed(() => project.value ? project.value.actions.filter(a => !a.completed && a.state === 'someday') : []);
const completedActionsList = computed(() => project.value ? project.value.actions.filter(a => a.completed) : []);

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
