<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Projects ({{ projectsCount }})</h1>
    <ol v-if="projectsCount > 0">
        <ProjectListItem v-for="project in projects" :key="project.lid" :project />
    </ol>
    <div v-else class="italic">No projects to show right now</div>
</template>

<script setup>
import { computed } from 'vue';
import ProjectListItem from '@/components/ProjectListItem.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';

const actionStore = useActionStore();
const { projects } = storeToRefs(actionStore);
const projectsCount = computed(() => projects.value?.length || 0);
</script>