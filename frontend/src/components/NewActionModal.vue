<template>
    <div class="fixed top-0 left-0 right-0 bottom-0 bg-black/40 flex items-center justify-center z-1">
        <div class="bg-white w-[750px]">
            <header class="flex justify-between bg-blue-600 p-4">
                <div class="text-white font-bold">{{ modalStore.editMode ? 'Edit action' : 'New action' }}</div>
                <button @click="modalStore.close()" class="block bg-white px-2 cursor-pointer">Close</button>
            </header>
            <form @submit.prevent="addAction" class="p-5">
                <label class="block mb-2" for="action-title">Title</label>
                <input v-focus type="text" name="action-title" id="action-title"
                    class="block mb-4 w-full border-1 border-gray-300 px-4 py-3" placeholder="Do the dishes"
                    autocomplete="off" required v-model.trim="newActionData.title">
                <label for="tags-list" class="block mb-2">Tags</label>
                <select id="tags-list" class="block mb-4 border-1 border-gray-300 px-4 py-3" multiple
                    v-model="newActionData.tags">
                    <option v-for="tag in tags" :key="tag.lid" :value="tag.lid">
                        {{ tag.name }}
                    </option>
                </select>
                <div class="flex gap-8">
                    <div>
                        <label for="action-state" class="block mb-2">State</label>
                        <select name="action-state" id="action-state"
                            class="block mb-4 border-1 border-gray-300 px-4 py-3" v-model="newActionData.state">
                            <option value="inbox">Inbox</option>
                            <option value="next">Next</option>
                            <option value="waiting">Waiting</option>
                            <option value="someday">Someday</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                    <div>
                        <label for="action-project" class="block mb-2">Project</label>
                        <select name="action-project" id="action-project"
                            class="block mb-4 border-1 border-gray-300 px-4 py-3" v-model="newActionData.projectLid">
                            <option value="">Standalone (no project)</option>
                            <option v-for="project in projectsList" :value="project.lid">{{ project.title }}</option>
                        </select>
                    </div>
                    <div v-if="newActionData.state === 'waiting'">
                        <label for="action-waiting-for" class="block mb-2">Waiting
                            for</label>
                        <select name="action-waiting-for" id="action-waiting-for"
                            class="block mb-4 border-1 border-gray-300 px-4 py-3" v-model="newActionData.waitingFor">
                            <option v-for="person in persons" :value="person.lid">{{ person.name }}</option>
                        </select>
                    </div>
                </div>
                <label class="block mb-2" for="action-notes">Notes</label>
                <textarea name="action-notes" id="action-notes"
                    class="block mb-4 w-full border-1 border-gray-300 px-4 py-3"
                    placeholder="Need to scrub until spotless" rows="3" v-model.trim="newActionData.notes"></textarea>
                <div class="flex gap-8">
                    <div class="flex-1">
                        <label class="block mb-2" for="action-time">Time</label>
                        <select class="block mb-4 border-1 border-gray-300 px-4 py-3 w-full" name="action-time"
                            id="action-time" v-model.number="newActionData.time">
                            <option value="">None</option>
                            <option value="5">5 minutes</option>
                            <option value="10">10 minutes</option>
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                            <option value="180">3 hours</option>
                            <option value="240">4 hours</option>
                            <option value="360">6 hours</option>
                            <option value="480">8 hours</option>
                        </select>
                    </div>
                    <div class="flex-1">
                        <label class="block mb-2" for="action-energy">Energy</label>
                        <select class="block mb-4 border-1 border-gray-300 px-4 py-3 w-full" name="action-energy"
                            id="action-energy" v-model="newActionData.energy">
                            <option value="">None</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="flex-1">
                        <label class="block mb-2" for="action-due">Due date</label>
                        <input name="action-due" id="action-due"
                            class="block mb-6 border-1 border-gray-300 px-4 py-3 leading-none w-full" type="date"
                            :min="new Date(Date.now()).toISOString().split('T')[0]" v-model="newActionData.due">
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
import { reactive, watch, toRaw } from 'vue';
import { db } from '@/db';
import { useActionModalStore } from '@/stores/modalStore';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { useActionStore } from '@/stores/actionStore';

const actionStore = useActionStore();
const { tags } = actionStore;
const persons = tags.filter(tag => tag.type === 'person'); // Assuming tags with type 'person' are used for waitingFor
const projectsList = useObservable(
    liveQuery(() => db.projects.filter(project => !project.deleted).toArray())
);
const modalStore = useActionModalStore();
const newActionDefaults = {
    title: '',
    time: '',
    energy: '',
    notes: '',
    due: '',
    state: 'inbox',
    waitingFor: '',
    projectLid: '',
    tags: [],
}
const newActionData = reactive({ ...newActionDefaults })

// Initialize form when modal opens for editing
watch(() => modalStore.currentAction, (currentAction) => {
    if (currentAction) {
        // Fill form with existing action data
        Object.assign(newActionData, {
            title: currentAction.title || '',
            time: currentAction.time || '',
            energy: currentAction.energy || '',
            notes: currentAction.notes || '',
            due: currentAction.due || '',
            state: currentAction.state || 'inbox',
            waitingFor: currentAction.waitingFor || '',
            projectLid: currentAction.projectLid || '',
            tags: currentAction.tags || []
        })
    } else {
        // Reset form for new action
        clearForm()
    }
}, { immediate: true })

function clearForm() {
    Object.assign(newActionData, newActionDefaults)
}

async function addAction() {
    // Title is required
    if (!newActionData.title) return;

    const action = {
        ...toRaw(newActionData),
        completed: modalStore.editMode ? modalStore.currentAction.completed : false,
        deleted: false
    }

    action.time = action.time || null
    action.energy = action.energy || null
    action.due = action.due || null
    action.waitingFor = action.waitingFor ? (action.state === 'waiting' && action.waitingFor) : null
    action.projectLid = action.projectLid || null
    if (action.projectLid && action.state === 'inbox') {
        action.state = 'next'; // If a project is selected, set state to 'next' if it was 'inbox'   
    }
    action.tags = action.tags.length ? action.tags : null; // Ensure tags is null if empty

    try {
        if (modalStore.editMode && modalStore.currentAction) {
            await db.actions.update(modalStore.currentAction.lid, action)
        } else {
            await db.actions.add(action)
        }

        // Reset the form and close the modal only on success
        clearForm()
        modalStore.close()
    } catch (error) {
        console.error('Database operation failed:', error)
    }
};
</script>
