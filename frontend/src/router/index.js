import { createRouter, createWebHistory } from 'vue-router'
import InboxView from '@/views/InboxView.vue'
import NextView from '@/views/NextView.vue'
import WaitingView from '@/views/WaitingView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import DeletedView from '@/views/DeletedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/next',
      name: 'next',
      component: NextView,
    },
    {
      path: '/waiting',
      name: 'waiting',
      component: WaitingView,
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: InboxView,
    },
    {
      path: '/deleted',
      name: 'deleted',
      component: DeletedView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    }
  ],
})

export default router
