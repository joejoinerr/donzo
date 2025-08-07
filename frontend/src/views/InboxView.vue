<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Inbox ({{ incompleteInboxActionsCount }})</h1>
    <ol v-if="incompleteInboxActions.length > 0" class="not-last:mb-8">
        <ActionListItem v-for="action in incompleteInboxActions" :key="action.lid" :action="action" />
    </ol>
    <div v-if="completeInboxActions.length > 0" class="not-last:mb-8">
        <h2 class="mb-3 font-bold text-gray-600">Done</h2>
        <ol>
            <ActionListItem v-for="action in completeInboxActions" :key="action.lid" :action="action" />
        </ol>
    </div>
    <div v-if="viewEmpty" class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const actionStore = useActionStore();
const { inboxActions } = storeToRefs(actionStore);
const incompleteInboxActions = computed(() => inboxActions.value?.filter(action => !action.completed) || []);
const completeInboxActions = computed(() => inboxActions.value?.filter(action => action.completed) || []);
const incompleteInboxActionsCount = computed(() => incompleteInboxActions.value?.length || 0);
const viewEmpty = computed(() => (inboxActions.value?.length || 0) === 0);
</script>