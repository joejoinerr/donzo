<template>
    <button class="py-2 px-3 mb-8 bg-red-200 cursor-pointer mr-2" @click="clearCompleted">Clear completed</button>
    <button class="py-2 px-3 mb-8 bg-red-200 cursor-pointer" @click="clearDeleted">Clear deleted (debug)</button>
    <div>Actions: {{ actionsCount }}</div>

    <ol v-if="actionsCount > 0">
        <li class="block flex items-start bg-white mb-[2px] p-3" v-for="action in actionsList" :key="action.lid">
            <input :checked="action.completed" class="mr-4 mt-2" type="checkbox" :id="`action-${action.lid}`"
                name="todo" @click="toggleCompleteAction(action.lid)">
            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <div>
                        <label :for="`action-${action.lid}`" :class="{ 'line-through': action.completed }">
                            <span>{{ action.title }}</span>
                        </label>
                        <button v-if="action.notes" class="ml-4 py-1 px-2 bg-gray-200 cursor-pointer font-bold"
                            @click="toggleNotes(action.lid)">
                            {{ visibleNotes[action.lid] ? '-' : '+' }}
                        </button>
                    </div>
                    <div class="flex items-center gap-x-3">
                        <div class="rounded-full bg-gray-200 px-2 text-sm" v-if="action.time">{{ formatTime(action.time)
                            }}
                        </div>
                        <div class="rounded-full bg-gray-200 px-2 text-sm" v-if="action.energy">{{
                            action.energy.toLowerCase()
                        }}</div>
                        <div class="rounded-full bg-gray-200 px-2 text-sm" v-if="action.due">{{ action.due }}</div>
                        <button class="ml-2 py-1 px-2 bg-gray-200 cursor-pointer"
                            @click="deleteAction(action.lid)">Delete</button>
                    </div>
                </div>
                <div v-if="action.notes && visibleNotes[action.lid]" class="px-3 py-1 border-l-2 border-gray-400 mt-2">
                    {{ action.notes }}
                </div>
            </div>
        </li>
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { reactive } from 'vue';
import { db } from '../db'

// Track which notes are visible
const visibleNotes = reactive({});

const actionsList = useObservable(
    liveQuery(() => db.actions.filter(action => !action.deleted).toArray())
)
const actionsCount = useObservable(
    liveQuery(() => db.actions.filter(action => !action.deleted).count())
)

function deleteAction(lid) {
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

function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes}m`;
    } else {
        const hoursText = `${Math.floor(minutes / 60)}h`;
        const minsRemainder = minutes % 60;
        if (minsRemainder === 0) return hoursText;
        return `${hoursText} ${minsRemainder}m`;
    }
}

function toggleNotes(lid) {
    visibleNotes[lid] = !visibleNotes[lid];
}
</script>
