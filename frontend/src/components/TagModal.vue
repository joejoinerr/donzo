<template>
    <div class="fixed top-0 left-0 right-0 bottom-0 bg-black/40 flex items-center justify-center z-1">
        <div class="bg-white w-[450px]">
            <header class="flex justify-between bg-blue-600 p-4">
                <div class="text-white font-bold">Tags</div>
                <button @click="tagModalStore.close()" class="block bg-white px-2 cursor-pointer">Close</button>
            </header>
            <input type="text" id="create-tag" name="create-tag"
                class="block mb-4 w-full border-1 border-gray-300 px-4 py-3" placeholder="Create new tag"
                v-model.trim="newTagData.name" @keyup.enter="createTag">
            <ul>
                <li v-for="tag in tags" :key="tag.lid" class="px-4 py-2 border-b border-gray-200">
                    <span class="font-bold">{{ tag.name }}</span> <span class="text-sm text-gray-500">({{ tag.type
                        }})</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { useTagModalStore } from '@/stores/modalStore';
import { db } from '@/db';
import { useActionStore } from '@/stores/actionStore';
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';

const actionStore = useActionStore();
const { tags } = storeToRefs(actionStore);
const tagModalStore = useTagModalStore();

const newTagDefaults = {
    name: '',
    type: 'context' // Default type, can be changed later
};
const newTagData = reactive({ ...newTagDefaults });

function clearForm() {
    Object.assign(newTagData, newTagDefaults);
}

async function createTag() {
    await db.tags.add({
        ...newTagData,
        deleted: false
    });
    clearForm();
}
</script>