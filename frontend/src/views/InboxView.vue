<template>
    <ol v-if="inboxActionsCount > 0">
        <ActionListItem v-for="action in inboxActionsList" :key="action.lid" :action="action" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';

const collection = db.actions.filter(action => !action.deleted && action.state === 'inbox');
const inboxActionsList = useObservable(
    liveQuery(() => collection.toArray())
)
const inboxActionsCount = useObservable(
    liveQuery(() => collection.count())
)
</script>