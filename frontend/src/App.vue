<template>
    <NewActionModal v-if="modalStore.isOpen" />
    <header class="flex justify-between bg-blue-600 p-4">
        <div><button @click="modalStore.openNew()" class="py-2 px-3 bg-white cursor-pointer">New action +</button>
        </div>
        <div>
            <button class="py-2 px-3 bg-red-200 cursor-pointer" @click="clearDeleted">Clear deleted
                (debug)</button>
        </div>
    </header>
    <main class="flex items-stretch h-[100vh]">
        <nav class="bg-white py-4 w-[220px]">
            <ul>
                <li>
                    <RouterLink to="/inbox" class="block px-3 py-4 hover:bg-gray-100 "
                        exactActiveClass="bg-gray-100 border-l-2 border-blue-500">
                        Inbox</RouterLink>
                </li>
                <li>
                    <RouterLink to="/next" class="block px-3 py-4 hover:bg-gray-100"
                        exactActiveClass="bg-gray-100 border-l-2 border-blue-500">Next</RouterLink>
                </li>
                <li>
                    <RouterLink to="/waiting" class="block px-3 py-4 hover:bg-gray-100"
                        exactActiveClass="bg-gray-100 border-l-2 border-blue-500">Waiting</RouterLink>
                </li>
            </ul>
        </nav>
        <section class="flex-1 p-6">
            <button class="py-2 px-3 mb-8 bg-red-200 cursor-pointer mr-2" @click="clearCompleted">Clear
                completed</button>

            <RouterView />
        </section>
    </main>
</template>

<script setup>
import NewActionModal from '@/components/NewActionModal.vue';
import { useModalStore } from '@/stores/modalStore';

const modalStore = useModalStore();

function clearCompleted() {
    db.actions.filter(action => action.completed).modify({ deleted: true })
    db.projcets.filter(project => project.completed).modify({ deleted: true })
}

function clearDeleted() {
    db.actions.filter(action => action.deleted).delete()
    db.projects.filter(project => project.deleted).delete()
}
</script>
