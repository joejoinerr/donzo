<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Someday ({{ incompleteActionsCount }})</h1>
    <ol v-if="incompleteActionsCount > 0" class="not-last:mb-8">
        <ActionListItem v-for="action in incompleteActions" :key="action.lid" :action="action" />
    </ol>
    <div v-if="completeActions.length > 0" class="not-last:mb-8">
        <h2 class="mb-3 font-bold text-gray-600">Done</h2>
        <ol>
            <ActionListItem v-for="action in completeActions" :key="action.lid" :action="action" />
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
const { somedayActions } = storeToRefs(actionStore);
const incompleteActions = computed(() => somedayActions.value?.filter(action => !action.completed) || []);
const completeActions = computed(() => somedayActions.value?.filter(action => action.completed) || []);
const incompleteActionsCount = computed(() => incompleteActions.value?.length || 0);
const viewEmpty = computed(() => (somedayActions.value?.length || 0) === 0);
</script>