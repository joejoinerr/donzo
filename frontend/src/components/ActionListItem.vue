<template>
    <li class="block flex items-start bg-white mb-[2px] p-3">
        <input :checked="action.completed"
            class="relative mr-4 mt-2 appearance-none border-1 w-[18px] h-[18px] rounded-sm cursor-pointer checked:bg-gray-500 checked:border-gray-500 before:content-['✔'] before:leading-none before:absolute before:left-[2px] before:text-white before:text-sm before:invisible checked:before:visible"
            :class="{ 'bg-red-400': isDueOrOverdue, 'border-red-600': isDueOrOverdue, 'border-gray-400': !isDueOrOverdue }"
            type="checkbox" :id="`action-${action.lid}`" name="todo" @click="toggleCompleteAction(action.lid)">
        <div class="flex-1">
            <div class="flex items-center justify-between">
                <div>
                    <label :for="`action-${action.lid}`" :class="{ 'line-through': action.completed }">
                        <span>{{ action.title }}</span>
                    </label>
                    <button v-if="action.notes" class="ml-4 py-1 px-2 bg-gray-200 cursor-pointer font-bold"
                        @click="toggleNotes">
                        {{ isNotesVisible ? '-' : '+' }}
                    </button>
                </div>
                <div class="flex items-center gap-x-3">
                    <div class="rounded-full bg-gray-200 px-2 text-sm" v-if="action.time">
                        {{ formatTime(action.time) }}
                    </div>
                    <div class="rounded-full bg-gray-200 px-2 text-sm" v-if="action.energy">
                        {{ action.energy.toLowerCase() }}
                    </div>
                    <div class="rounded-full bg-gray-200 px-2 text-sm" v-if="action.due">
                        {{ action.due }}
                    </div>
                    <button class="ml-2 py-1 px-2 bg-gray-200 cursor-pointer"
                        @click="deleteAction(action.lid)">Delete</button>
                </div>
            </div>
            <div v-if="action.notes && isNotesVisible" class="px-3 py-1 border-l-2 border-gray-400 mt-2">
                {{ action.notes }}
            </div>
        </div>
    </li>
</template>

<script setup>
import { ref, computed } from 'vue';
import { db } from '@/db';

const props = defineProps({
    action: {
        type: Object,
        required: true
    }
});

const isDueOrOverdue = computed(() => {
    if (!props.action.due) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const dueDate = new Date(props.action.due);
    dueDate.setHours(0, 0, 0, 0); // Set to start of day

    return dueDate <= today;
});

const isNotesVisible = ref(false);

function toggleNotes() {
    isNotesVisible.value = !isNotesVisible.value;
}

function toggleCompleteAction(lid) {
    db.transaction('rw', [db.actions], async () => {
        const action = await db.actions.get(lid)
        db.actions.update(lid, { completed: !action.completed })
    });
}

function deleteAction(lid) {
    db.actions.update(lid, { deleted: true })
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
</script>
