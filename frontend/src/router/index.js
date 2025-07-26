import { createRouter, createWebHistory } from 'vue-router'
import InboxView from '../views/InboxView.vue'
import NextView from '../views/NextView.vue'
import WaitingView from '@/views/WaitingView.vue'

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
    }
  ],
})

export default router
