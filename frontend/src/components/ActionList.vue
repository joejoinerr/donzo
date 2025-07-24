<template>
    <button class="py-2 px-3 mb-8 bg-red-200 cursor-pointer mr-2" @click="clearCompleted">Clear completed</button>
    <button class="py-2 px-3 mb-8 bg-red-200 cursor-pointer" @click="clearDeleted">Clear deleted (debug)</button>
    <div>Actions: {{ actionsCount }}</div>

    <ul>
        <li class="mb-2" v-for="action in actionsList" :key="action.lid">
            <input :checked="action.completed" class="mr-4" type="checkbox" :id="`action-${action.lid}`" name="todo"
                @click="toggleCompleteAction(action.lid)">
            <label :for="`action-${action.lid}`" :class="{ 'line-through': action.completed }">{{ action.title }} (time:
                {{ formatTime(action.time) }}, energy: {{ action.energy || '<none>' }}, due: {{ action.due || '<none>'
                }}, notes: {{ action.notes ? 'SET' : '<none>' }})</label>
            <button class="ml-4 py-1 px-2 bg-gray-200 cursor-pointer" @click="deleteAction(action.lid)">Delete</button>
        </li>
    </ul>
    <!-- <div v-else>No items to show right now</div> -->
</template>

<script setup>
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db'

function formatTime(minutes) {
    if (!minutes) return "<none>";
    
    if (minutes < 60) {
        return `${minutes}m`;
    } else {
        return `${minutes / 60}h`;
    }
}

const actionsList = useObservable(
    liveQuery(() => db.actions.filter(action => !action.deleted).toArray())
)
const actionsCount = useObservable(
    liveQuery(() => db.actions.filter(action => !action.deleted).count())
)

function deleteAction(lid) {
    // db.actions.delete(lid)
    db.actions.update(lid, { deleted: true })
}

function toggleCompleteAction(lid) {
    db.transaction('rw', [db.actions], async () => {
        const action = await db.actions.get(lid)
        db.actions.update(lid, { completed: !action.completed })
    });
}

function clearCompleted() {
    db.actions.filter(action => action.completed).modify({ deleted: true })
}

function clearDeleted() {
    db.actions.filter(action => action.deleted).delete()
}
</script>
