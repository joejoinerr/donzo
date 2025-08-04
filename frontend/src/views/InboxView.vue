<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Inbox ({{ inboxActionsCount }})</h1>
    <ol v-if="inboxActionsCount > 0">
        <ActionListItem v-for="action in inboxActions" :key="action.lid" :action="action" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const actionStore = useActionStore();
const { inboxActions } = storeToRefs(actionStore);
const inboxActionsCount = computed(() => inboxActions.value?.length || 0);
</script>