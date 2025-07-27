<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Someday</h1>
    <ol v-if="somedayActionsCount > 0">
        <ActionListItem v-for="action in somedayActionsList" :key="action.lid" :action="action" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';

const collection = db.actions.filter(action => !action.deleted && action.state === 'someday');
const somedayActionsList = useObservable(
    liveQuery(() => collection.toArray())
)
const somedayActionsCount = useObservable(
    liveQuery(() => collection.count())
)
</script>