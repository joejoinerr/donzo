<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">Waiting ({{ waitingActionsCount }})</h1>
    <ol v-if="waitingActionsCount > 0">
        <ActionListItem v-for="action in waitingActions" :key="action.lid" :action="action" />
    </ol>
    <div v-else class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const actionStore = useActionStore();
const { waitingActions } = storeToRefs(actionStore);
const waitingActionsCount = computed(() => waitingActions.value?.length || 0);
</script>