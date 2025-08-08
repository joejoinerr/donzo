import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActionModalStore = defineStore('actionModal', () => {
  const isOpen = ref(false)
  const editMode = ref(false)
  const currentAction = ref(null)

  function openNew() {
    isOpen.value = true
    editMode.value = false
    currentAction.value = null
  }

  function openEdit(action) {
    currentAction.value = { ...action }
    isOpen.value = true
    editMode.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    editMode,
    currentAction,
    openNew,
    openEdit,
    close
  }
})

export const useProjectModalStore = defineStore('projectModal', () => {
  const isOpen = ref(false)
  const editMode = ref(false)
  const currentProject = ref(null)

  function openNew() {
    isOpen.value = true
    editMode.value = false
    currentProject.value = null
  }

  function openEdit(project) {
    currentProject.value = { ...project }
    isOpen.value = true
    editMode.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    editMode,
    currentProject,
    openNew,
    openEdit,
    close
  }
})

export const useTagModalStore = defineStore('tagModal', () => {
  const isOpen = ref(false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    open,
    close
  }
})
