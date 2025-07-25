<template>
    <button class="py-2 px-3 mb-8 bg-red-200 cursor-pointer mr-2" @click="clearCompleted">Clear completed</button>
    <button class="py-2 px-3 mb-8 bg-red-200 cursor-pointer" @click="clearDeleted">Clear deleted (debug)</button>
    <div>Actions: {{ actionsCount }}</div>

    <ol v-if="actionsCount > 0">
        <ActionListItem v-for="action in actionsList" :key="action.lid" :action="action"
            @toggle-complete="toggleCompleteAction" @delete="deleteAction" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';
import ActionListItem from './ActionListItem.vue';

const actionsList = useObservable(
    liveQuery(() => db.actions.filter(action => !action.deleted).toArray())
)
const actionsCount = useObservable(
    liveQuery(() => db.actions.filter(action => !action.deleted).count())
)

function clearCompleted() {
    db.actions.filter(action => action.completed).modify({ deleted: true })
}

function clearDeleted() {
    db.actions.filter(action => action.deleted).delete()
}

</script>
