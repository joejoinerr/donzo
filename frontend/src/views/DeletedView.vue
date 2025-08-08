<template>
    <ActionListView title="Deleted" :actions="deletedActions" />
</template>

<script setup>
import ActionListView from '@/components/ActionListView.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';

const actionStore = useActionStore();
const { deletedActions } = storeToRefs(actionStore);
</script>
