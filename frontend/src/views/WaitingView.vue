<template>
    <ol v-if="waitingActionsCount > 0">
        <ActionListItem v-for="action in waitingActionsList" :key="action.lid" :action="action" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';

const collection = db.actions.filter(action => !action.deleted && action.state === 'waiting');
const waitingActionsList = useObservable(
    liveQuery(() => collection.toArray())
)
const waitingActionsCount = useObservable(
    liveQuery(() => collection.count())
)
</script>