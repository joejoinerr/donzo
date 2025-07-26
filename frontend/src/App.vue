<template>
    <NewActionModal v-if="isNewActionShowing" @close="hideNewAction" />
    <header class="bg-blue-600 p-4">
        <button @click="toggleNewAction" class="py-2 px-3 bg-white cursor-pointer mr-2">New action +</button>
    </header>
    <main class="flex items-stretch h-[100vh]">
        <nav class="bg-white py-4 w-[220px]">
            <ul>
                <li>
                    <RouterLink to="/inbox" class="block px-3 py-4 hover:bg-gray-100">Inbox</RouterLink>
                </li>
                <li>
                    <RouterLink to="/next" class="block px-3 py-4 hover:bg-gray-100">Next</RouterLink>
                </li>
                <li>
                    <RouterLink to="/waiting" class="block px-3 py-4 hover:bg-gray-100">Waiting</RouterLink>
                </li>
            </ul>
        </nav>
        <section class="flex-1 p-6">
            <RouterView />
        </section>
    </main>
</template>

<script setup>
import NewActionModal from '@/components/NewActionModal.vue';
import { ref } from 'vue';

let isNewActionShowing = ref(false)

function toggleNewAction() {
    isNewActionShowing.value = !isNewActionShowing.value
}

function hideNewAction() {
    isNewActionShowing.value = false
}
</script>