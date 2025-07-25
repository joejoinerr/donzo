<template>
    <li class="block flex items-start bg-white mb-[2px] p-3">
        <input :checked="action.completed" class="mr-4 mt-2" type="checkbox" :id="`action-${action.lid}`"
            name="todo" @click="$emit('toggle-complete', action.lid)">
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
                        @click="$emit('delete', action.lid)">Delete</button>
                </div>
            </div>
            <div v-if="action.notes && isNotesVisible" class="px-3 py-1 border-l-2 border-gray-400 mt-2">
                {{ action.notes }}
            </div>
        </div>
    </li>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    action: {
        type: Object,
        required: true
    }
});

defineEmits(['toggle-complete', 'delete']);

const isNotesVisible = ref(false);

function toggleNotes() {
    isNotesVisible.value = !isNotesVisible.value;
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
