<template>
    <input :checked="item.completed"
        class="relative mr-4 mt-2 appearance-none border-1 w-[18px] h-[18px] rounded-sm cursor-pointer checked:bg-gray-500 checked:border-gray-500 before:content-['✔'] before:leading-none before:absolute before:left-[2px] before:text-white before:text-sm before:invisible checked:before:visible"
        :class="{ 'bg-red-400': isDueOrOverdue, 'border-red-600': isDueOrOverdue, 'border-gray-400': !isDueOrOverdue }"
        type="checkbox" :id="`${itemType}-${item.lid}`">
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    itemType: {
        type: String,
        default: 'action' // or 'action' based on your use case
    }
});

const isDueOrOverdue = computed(() => {
    if (!props.item.due) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const dueDate = new Date(props.item.due);
    dueDate.setHours(0, 0, 0, 0); // Set to start of day

    return dueDate <= today;
});
</script>