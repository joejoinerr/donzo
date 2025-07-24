<template>
    <div class="border-1 border-blue-600 mb-6">
        <header class="bg-blue-600 p-4 text-white font-bold">New action</header>
        <form @submit.prevent="addAction" class="p-4">
            <label class="block mb-2" for="action-title">Title</label>
            <input 
                type="text"
                name="action-title"
                class="block mb-4 w-full border-1 border-gray-300 px-4 py-3"
                placeholder="Do the dishes"
                autocomplete="off"
                required
                v-model.trim="newActionData.title"
            >
            <label class="block mb-2" for="action-time">Time</label>
            <select class="block mb-4 border-1 border-gray-300 px-4 py-3 w-40" name="action-time" v-model.number="newActionData.time">
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
            <label class="block mb-2" for="action-energy">Energy</label>
            <select class="block mb-4 border-1 border-gray-300 px-4 py-3 w-40" name="action-energy" v-model="newActionData.energy">
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <label class="block mb-2" for="action-due">Due date</label>
            <input name="action-due" class="block mb-6 border-1 border-gray-300 px-4 py-3" type="date" :min="new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]">
            <input type="submit" class="py-2 px-6 border-1 border-blue-600 text-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white" value="Submit">
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { db } from '@/db';

const newActionDefaults = {
    title: '',
    time: '',
    energy: '',
}
const newActionData = reactive({ ...newActionDefaults })

function clearForm() {
    Object.assign(newActionData, newActionDefaults)
}

function addAction() {
    // Title is required
    if (!newActionData.title) return;
    const action = {
        ...newActionData,
        completed: false,
        deleted: false
    }
    action.time = action.time ? action.time : null
    action.energy = action.energy ? action.energy : null
    db.actions.add(action)
    // Reset the form
    clearForm()
};
</script>