<template>
    <NewActionModal v-if="actionModalStore.isOpen" />
    <NewProjectModal v-if="projectModalStore.isOpen" />
    <div class="flex flex-col h-screen">
        <header class="flex justify-between bg-blue-600 p-4">
            <div>
                <button @click="actionModalStore.openNew()" class="py-2 px-3 bg-white cursor-pointer mr-3">New action
                    +</button>
                <button @click="projectModalStore.openNew()" class="py-2 px-3 bg-white cursor-pointer">New project
                    +</button>
            </div>
            <div>
                <button class="py-2 px-3 bg-red-200 cursor-pointer" @click="clearCompleted">Clear
                    completed</button>
                <button class="py-2 px-3 bg-red-200 cursor-pointer ml-2" @click="clearDeleted">Clear deleted</button>
            </div>
        </header>
        <main class="flex flex-1 items-stretch h-full">
            <nav class="bg-white w-[220px]">
                <ul class="flex flex-col justify-between h-full">
                    <div class="flex-1">
                        <li>
                            <RouterLink :to="{ name: 'inbox' }" class="block px-3 py-4 hover:bg-gray-100 "
                                exactActiveClass="bg-gray-100 border-l-2 border-blue-500">
                                Inbox</RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ name: 'next' }" class="block px-3 py-4 hover:bg-gray-100"
                                exactActiveClass="bg-gray-100 border-l-2 border-blue-500">Next</RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ name: 'waiting' }" class="block px-3 py-4 hover:bg-gray-100"
                                exactActiveClass="bg-gray-100 border-l-2 border-blue-500">Waiting</RouterLink>
                        </li>
                        <li class="pb-1 border-b border-gray-200">
                            <RouterLink :to="{ name: 'someday' }" class="block px-3 py-4 hover:bg-gray-100"
                                exactActiveClass="bg-gray-100 border-l-2 border-blue-500">Someday</RouterLink>
                        </li>
                        <li class="pt-1">
                            <RouterLink :to="{ name: 'projects' }" class="block px-3 py-4 hover:bg-gray-100"
                                exactActiveClass="bg-gray-100 border-l-2 border-blue-500">Projects</RouterLink>
                        </li>
                    </div>
                    <div>
                        <li class="border-t border-gray-200 py-1">
                            <RouterLink :to="{ name: 'deleted' }" class="block px-3 py-4 hover:bg-gray-100"
                                exactActiveClass="bg-gray-100 border-l-2 border-blue-500">Deleted</RouterLink>
                        </li>
                    </div>
                </ul>
            </nav>
            <section class="flex-1 p-6">
                <RouterView />
            </section>
        </main>
    </div>
</template>

<script setup>
import NewActionModal from '@/components/NewActionModal.vue';
import NewProjectModal from '@/components/NewProjectModal.vue';
import { useActionModalStore, useProjectModalStore } from '@/stores/modalStore';
import { db } from '@/db';

const actionModalStore = useActionModalStore();
const projectModalStore = useProjectModalStore();

function clearCompleted() {
    db.actions.filter(action => action.completed).modify({ deleted: true })
    db.projects.filter(project => project.completed).modify({ deleted: true })
}

function clearDeleted() {
    db.actions.filter(action => action.deleted).delete()
    db.projects.filter(project => project.deleted).delete()
}
</script>
