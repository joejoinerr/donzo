<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">{{ project?.title || 'Loading...' }}</h1>
    <div v-if="nextActionsList.length > 0" class="not-last:mb-8">
        <h2 class="mb-3 font-bold text-gray-600">Next</h2>
        <ol>
            <ActionListItem v-for="action in nextActionsList" :key="action.lid" :action="action" />
        </ol>
    </div>
    <div v-if="somedayActionsList.length > 0" class="not-last:mb-8">
        <h2 class="mb-3 font-bold text-gray-600">Someday</h2>
        <ol>
            <ActionListItem v-for="action in somedayActionsList" :key="action.lid" :action="action" />
        </ol>
    </div>
    <div v-if="completedActionsList.length > 0">
        <h2 class="mb-3 font-bold text-gray-600">Done</h2>
        <ol>
            <ActionListItem v-for="action in completedActionsList" :key="action.lid" :action="action" />
        </ol>
    </div>
    <div v-if="actionsList.value && actionsList.value.length === 0" class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '../db';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const projectLid = Number(route.params.projectLid);

const actionsList = useObservable(
    liveQuery(() =>
        db.actions
            .filter(action => !action.deleted && action.projectLid === projectLid)
            .toArray()
    )
)

const nextActionsList = computed(() => actionsList.value ? actionsList.value.filter(a => !a.completed && a.state === 'next') : []);
const somedayActionsList = computed(() => actionsList.value ? actionsList.value.filter(a => !a.completed && a.state === 'someday') : []);
const completedActionsList = computed(() => actionsList.value ? actionsList.value.filter(a => a.completed) : []);

const project = useObservable(
    liveQuery(() => db.projects.get(projectLid))
)
</script>
