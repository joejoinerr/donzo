<template>
    <ActionListView title="Waiting" :actions="waitingActions" />
</template>

<script setup>
import ActionListView from '@/components/ActionListView.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';

const actionStore = useActionStore();
const { waitingActions } = storeToRefs(actionStore);
</script>
