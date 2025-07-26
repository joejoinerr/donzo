import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const editMode = ref(false)
  const currentAction = ref(null)

  function openNew() {
    isOpen.value = true
    editMode.value = false
    currentAction.value = null
  }

  function openEdit(action) {
    isOpen.value = true
    editMode.value = true
    currentAction.value = { ...action }
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
