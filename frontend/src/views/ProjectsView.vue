<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Projects</h1>
    <ol v-if="projectsCount > 0">
        <ProjectListItem v-for="project in projectsList" :key="project.lid" :project />
    </ol>
    <div v-else class="italic">No projects to show right now</div>
</template>

<script setup>
import { computed } from 'vue';
import ProjectListItem from '@/components/ProjectListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';

const collection = db.projects.filter(project => !project.deleted);
const projectsList = useObservable(
    liveQuery(async () => await collection.toArray())
)

const projectsCount = computed(() => projectsList.value ? projectsList.value.length : 0);
</script>