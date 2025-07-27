<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">{{ project.title }}</h1>
    <ol v-if="nextActionsCount > 0">
        <ActionListItem v-for="action in nextActionsList" :key="action.lid" :action="action" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';
import { useRoute } from 'vue-router';

const route = useRoute();
const collection = db.actions.filter(action => !action.deleted && action.projectLid === Number(route.params.projectLid));
const nextActionsList = useObservable(
    liveQuery(() => collection.toArray())
)
const nextActionsCount = useObservable(
    liveQuery(() => collection.count())
)
const project = useObservable(
    liveQuery(() => db.projects.get(Number(route.params.projectLid)))
)
</script>