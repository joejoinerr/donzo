<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">{{ project?.title || 'Loading...' }}</h1>
    <template v-if="nextActionsCount && nextActionsCount > 0">
        <h2>Next</h2>
        <ol>
            <ActionListItem v-for="action in nextActionsList || []" :key="action.lid" :action="action" />
        </ol>
    </template>
    <template v-if="somedayActionsCount && somedayActionsCount > 0">
        <h2>Someday</h2>
        <ol>
            <ActionListItem v-for="action in somedayActionsList || []" :key="action.lid" :action="action" />
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
const projectLid = Number(route.params.projectLid);

// Use independent liveQuery calls instead of chained filters
const nextActionsList = useObservable(
    liveQuery(() =>
        db.actions
            .filter(action =>
                !action.deleted &&
                action.projectLid === projectLid &&
                action.state === 'next'
            )
            .toArray()
    )
)

const nextActionsCount = useObservable(
    liveQuery(() =>
        db.actions
            .filter(action =>
                !action.deleted &&
                action.projectLid === projectLid &&
                action.state === 'next'
            )
            .count()
    )
)

const somedayActionsList = useObservable(
    liveQuery(() =>
        db.actions
            .filter(action =>
                !action.deleted &&
                action.projectLid === projectLid &&
                action.state === 'someday'
            )
            .toArray()
    )
)

const somedayActionsCount = useObservable(
    liveQuery(() =>
        db.actions
            .filter(action =>
                !action.deleted &&
                action.projectLid === projectLid &&
                action.state === 'someday'
            )
            .count()
    )
)

const project = useObservable(
    liveQuery(() => db.projects.get(projectLid))
)
</script>
