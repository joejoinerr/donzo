<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Deleted</h1>
    <ol v-if="deletedActionsCount > 0">
        <ActionListItem v-for="action in deletedActionsList" :key="action.lid" :action="action" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';

const collection = db.actions.filter(action => action.deleted);
const deletedActionsList = useObservable(
    liveQuery(() => collection.toArray())
)
const deletedActionsCount = useObservable(
    liveQuery(() => collection.count())
)
</script>