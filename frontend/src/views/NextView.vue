<template>
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

const collection = db.actions.filter(action => !action.deleted && action.state === 'next');
const nextActionsList = useObservable(
    liveQuery(() => collection.toArray())
)
const nextActionsCount = useObservable(
    liveQuery(() => collection.count())
)
</script>