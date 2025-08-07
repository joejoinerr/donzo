<template>
    <ActionListView title="Next" :actions="nextActions" />
</template>

<script setup>
import ActionListView from '@/components/ActionListView.vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';

const actionStore = useActionStore();
const { nextActions } = storeToRefs(actionStore);
</script>
