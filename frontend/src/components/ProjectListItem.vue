<template>
    <li class="block flex items-start bg-white mb-[2px] p-3">
        <input :checked="project.completed"
            class="relative mr-4 mt-2 appearance-none border-1 w-[18px] h-[18px] rounded-sm cursor-pointer checked:bg-gray-500 checked:border-gray-500 before:content-['✔'] before:leading-none before:absolute before:left-[2px] before:text-white before:text-sm before:invisible checked:before:visible"
            :class="{ 'bg-red-400': isDueOrOverdue, 'border-red-600': isDueOrOverdue, 'border-gray-400': !isDueOrOverdue }"
            type="checkbox" :id="`project-${project.lid}`" name="todo" @click="toggleCompleteProject(project.lid)">
        <div class="flex-1">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <label :for="`project-${project.lid}`">
                        <button class="cursor-pointer hover:underline" @click.stop.prevent="editProject">{{
                            project.title
                        }}</button>
                    </label>
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
import { ref, computed } from 'vue';
import { db } from '@/db';
import { useProjectModalStore } from '@/stores/modalStore';

const modalStore = useProjectModalStore();

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
});

const isDueOrOverdue = computed(() => {
    if (!props.project.due) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const dueDate = new Date(props.project.due);
    dueDate.setHours(0, 0, 0, 0); // Set to start of day

    return dueDate <= today;
});

const isNotesVisible = ref(false);

function showHideNotes() {
    isNotesVisible.value = !isNotesVisible.value;
}

function toggleCompleteProject(lid) {
    db.transaction('rw', [db.projects], async () => {
        const project = await db.projects.get(lid)
        db.projects.update(lid, { completed: !project.completed })
    });
}

function deleteProject(lid) {
    db.projects.update(lid, { deleted: true })
}

function editProject() {
    modalStore.openEdit(props.project);
}
</script>
