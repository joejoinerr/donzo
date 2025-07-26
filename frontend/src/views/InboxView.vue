<template>
    <ActionList :actions="actionList" />
</template>

<script setup>
import ActionList from '@/components/ActionList.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';

const actionList = useObservable(
    liveQuery(() => db.actions.filter(action => !action.deleted && action.state === 'inbox').toArray())
)
</script>