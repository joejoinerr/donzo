<template>
    <ActionListView title="Inbox" :actions="inboxActions" />
</template>

<script setup>
import ActionListView from '@/components/ActionListView.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';

const actionStore = useActionStore();
const { inboxActions } = storeToRefs(actionStore);
</script>
