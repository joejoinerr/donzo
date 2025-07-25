<template>
    <div><button @click="toggleNewAction" class="py-2 px-3 mb-8 bg-white cursor-pointer mr-2">Toggle new
            action</button></div>
    <NewActionModal v-if="isNewActionShowing" @close="hideNewAction" />
    <ActionList />
</template>

<script setup>
import ActionList from './components/ActionList.vue';
import NewActionModal from './components/NewActionModal.vue';
import { ref } from 'vue';

let isNewActionShowing = ref(false)

function toggleNewAction() {
    isNewActionShowing.value = !isNewActionShowing.value
}

function hideNewAction() {
    isNewActionShowing.value = false
}
</script>