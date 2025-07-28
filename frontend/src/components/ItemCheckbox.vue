<template>
    <input type="checkbox" :checked="completed" @change="$emit('check')"
        class="relative mr-4 mt-2 appearance-none border-1 w-[18px] h-[18px] rounded-sm cursor-pointer checked:bg-gray-500 checked:border-gray-500 before:content-['✔'] before:leading-none before:absolute before:left-[2px] before:text-white before:text-sm before:invisible checked:before:visible"
        :class="{ 'bg-red-400': isDueOrOverdue, 'border-red-600': isDueOrOverdue, 'border-gray-400': !isDueOrOverdue }">
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    dueDate: {
        type: String,
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(['check']);

const isDueOrOverdue = computed(() => {
    if (!props.dueDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const dueDate = new Date(props.dueDate);
    dueDate.setHours(0, 0, 0, 0); // Set to start of day

    return dueDate <= today;
});
</script>