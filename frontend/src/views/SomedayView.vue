<template>
    <ActionListView title="Someday" :actions="somedayActions" />
</template>

<script setup>
import ActionListView from '@/components/ActionListView.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';

const actionStore = useActionStore();
const { somedayActions } = storeToRefs(actionStore);
</script>
