<template>
    <div class="fixed top-0 left-0 right-0 bottom-0 bg-black/40 flex items-center justify-center z-1">
        <div class="bg-white w-[750px]">
            <header class="flex justify-between bg-blue-600 p-4">
                <div class="text-white font-bold">{{ modalStore.editMode ? 'Edit project' : 'New project' }}</div>
                <button @click="modalStore.close()" class="block bg-white px-2 cursor-pointer">Close</button>
            </header>
            <form @submit.prevent="addProject" class="p-5">
                <label class="block mb-2" for="action-title">Title</label>
                <input autofocus type="text" name="action-title" id="action-title"
                    class="block mb-4 w-full border-1 border-gray-300 px-4 py-3" placeholder="Do the dishes"
                    autocomplete="off" required v-model.trim="newProjectData.title">
                <div class="flex gap-8">
                    <div>
                        <label for="action-state" class="block mb-2">State</label>
                        <select name="action-state" id="action-state"
                            class="block mb-4 border-1 border-gray-300 px-4 py-3" v-model="newProjectData.state">
                            <option value="active">Active</option>
                            <option value="someday">Someday</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>
                <label class="block mb-2" for="action-notes">Notes</label>
                <textarea name="action-notes" id="action-notes"
                    class="block mb-4 w-full border-1 border-gray-300 px-4 py-3"
                    placeholder="Need to scrub until spotless" rows="3" v-model.trim="newProjectData.notes"></textarea>
                <div class="flex gap-8">
                    <div>
                        <label class="block mb-2" for="action-due">Due date</label>
                        <input name="action-due" id="action-due"
                            class="block mb-6 border-1 border-gray-300 px-4 py-3 leading-none w-full" type="date"
                            :min="new Date(Date.now()).toISOString().split('T')[0]" v-model="newProjectData.due">
                    </div>
                </div>
                <input type="submit"
                    class="py-2 px-6 border-1 border-blue-600 text-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white"
                    :value="modalStore.editMode ? 'Update' : 'Submit'">
                <input type="button" class="py-2 px-6 border-1 border-gray-300 text-gray-600 cursor-pointer ml-4"
                    value="Cancel" @click="modalStore.close()">
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { db } from '@/db';
import { useProjectModalStore } from '@/stores/modalStore';

const modalStore = useProjectModalStore();
const newProjectDefaults = {
    title: '',
    notes: '',
    due: '',
    state: 'active',
}
const newProjectData = reactive({ ...newProjectDefaults })

// Initialize form when modal opens for editing
watch(() => modalStore.currentProject, (currentProject) => {
    if (currentProject) {
        // Fill form with existing project data
        Object.assign(newProjectData, {
            title: currentProject.title || '',
            notes: currentProject.notes || '',
            due: currentProject.due || '',
            state: currentProject.state || 'active'
        })
    } else {
        // Reset form for new project
        clearForm()
    }
}, { immediate: true })

function clearForm() {
    Object.assign(newProjectData, newProjectDefaults)
}

function addProject() {
    // Title is required
    if (!newProjectData.title) return;

    const project = {
        ...newProjectData,
        completed: modalStore.editMode ? modalStore.currentProject.completed : false,
        deleted: false
    }
    project.due = project.due || null

    if (modalStore.editMode && modalStore.currentProject) {
        // Update existing project
        db.projects.update(modalStore.currentProject.lid, project)
    } else {
        // Add new project
        db.projects.add(project)
    }

    // Reset the form and close the modal
    clearForm()
    modalStore.close()
};
</script>
