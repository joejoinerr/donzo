<template>
    <li class="block flex items-start bg-white mb-[2px] p-3">
        <ItemCheckbox :due-date="project.due" :completed="project.completed" @check="toggleCompleteProject" />
        <div class="flex-1">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <RouterLink :to="{ name: 'project-actions', params: { projectLid: project.lid } }"
                        class="mr-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-200">
                        {{ actionCount }} Actions</RouterLink>
                    <button class="cursor-pointer hover:underline" @click="editProject">{{
                        project.title
                        }}</button>
                    <button v-if="project.notes"
                        class="leading-none ml-4 bg-gray-200 cursor-pointer font-bold w-[20px] h-[20px] text-center"
                        @click="showHideNotes">
                        {{ isNotesVisible ? '-' : '+' }}
                    </button>
                </div>
                <div class="flex items-center gap-x-3">
                    <div class="rounded-full bg-gray-200 px-2 text-sm" v-if="project.due">
                        {{ project.due }}
                    </div>
                    <button class="ml-2 py-1 px-2 bg-gray-200 cursor-pointer"
                        @click="deleteProject(project.lid)">Delete</button>
                </div>
            </div>
            <div v-if="project.notes && isNotesVisible" class="px-3 py-1 border-l-2 border-gray-400 mt-2">
                {{ project.notes }}
            </div>
        </div>
    </li>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '@/db';
import { useProjectModalStore } from '@/stores/modalStore';
import { liveQuery } from 'dexie';
import { useObservable } from '@vueuse/rxjs';
import ItemCheckbox from '@/components/ItemCheckbox.vue';
import { RouterLink } from 'vue-router';

const modalStore = useProjectModalStore();
const props = defineProps({
    project: {
        type: Object,
        required: true
    }
});
const actionCount = useObservable(
    liveQuery(async () => await db.actions.filter(a => !a.deleted && !a.completed && a.projectLid === props.project.lid).count())
);
const isNotesVisible = ref(false);

function showHideNotes() {
    isNotesVisible.value = !isNotesVisible.value;
}

function deleteProject(lid) {
    db.projects.update(lid, { deleted: true })
}

function editProject() {
    modalStore.openEdit(props.project);
}

// function toggleCompleteProject(lid) {
//     db.transaction('rw', [db.projects], async () => {
//         const project = await db.projects.get(lid)
//         const newCompletedState = !project.completed;
//         db.projects.update(lid, { completed: newCompletedState });

//         // Mark all actions in this project as completed but if project is completed,
//         // but we don't want to uncomplete them if it's undone.
//         if (newCompletedState) {
//             db.actions.where('projectLid').equals(lid).modify({ completed: !project.completed });
//         }
//     });
// }

async function toggleCompleteProject() {
    db.transaction('rw', [db.projects], async () => {
        const newCompletedState = !props.project.completed;
        await db.projects.update(props.project.lid, { completed: newCompletedState });
        // If the project is being marked as completed, mark all its actions as completed
        if (newCompletedState) {
            await db.actions.filter(action => action.projectLid === props.project.lid && !action.completed)
                .modify({ completed: true });
        }
    });
}
</script>
