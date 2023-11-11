import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/kanasta',
      name: 'kanasta',
      component: () => import('../views/KanastaGame.vue')
    },
    {
      path: '/qwirkle',
      name: 'qwirkle',
      component: () => import('../views/QwirkleGame.vue')
    }
  ]
})

export default router
