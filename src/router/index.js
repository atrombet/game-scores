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
      path: '/canasta',
      name: 'canasta',
      component: () => import('../views/KanastaGame.vue')
    },
    {
      path: '/qwirkle',
      name: 'qwirkle',
      component: () => import('../views/QwirkleGame.vue')
    },
    {
      path: '/star-realms',
      name: 'star-realms',
      component: () => import('../views/StarRealmsGame.vue')
    }
  ]
})

export default router
