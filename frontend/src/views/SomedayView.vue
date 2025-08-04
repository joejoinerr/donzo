<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Someday</h1>
    <ol v-if="somedayActionsCount > 0">
        <ActionListItem v-for="action in somedayActions" :key="action.lid" :action="action" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const actionStore = useActionStore();
const { somedayActions } = storeToRefs(actionStore);
const somedayActionsCount = computed(() => somedayActions.value?.length || 0);
</script>