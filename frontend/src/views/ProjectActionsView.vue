<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">{{ project?.title || 'Loading...' }}</h1>
    <template v-if="nextActionsCount > 0">
        <h2>Next</h2>
        <ol>
            <ActionListItem v-for="action in nextActionsList" :key="action.lid" :action="action" />
        </ol>
    </template>
    <template v-if="somedayActionsCount > 0">
        <h2>Someday</h2>
        <ol>
            <ActionListItem v-for="action in somedayActionsList" :key="action.lid" :action="action" />
        </ol>
    </template>
    <!-- <div v-else class="italic">No items to show right now</div> -->
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';
import { useRoute } from 'vue-router';

const route = useRoute();
const collection = db.actions.filter(action => !action.deleted && action.projectLid === Number(route.params.projectLid));
const nextActionsCollection = collection.filter(action => action.state === 'next');
const somedayActionsCollection = collection.filter(action => action.state === 'someday');
const nextActionsList = useObservable(
    liveQuery(() => nextActionsCollection.toArray())
)
const nextActionsCount = useObservable(
    liveQuery(() => nextActionsCollection.count())
)
const somedayActionsList = useObservable(
    liveQuery(() => somedayActionsCollection.toArray())
)
const somedayActionsCount = useObservable(
    liveQuery(() => somedayActionsCollection.count())
)
const project = useObservable(
    liveQuery(() => db.projects.get(Number(route.params.projectLid)))
)
</script>
