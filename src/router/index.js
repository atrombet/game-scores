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
      path: '/tally',
      name: 'tally',
      component: () => import('../views/ScoreTallyGame.vue')
    },
    {
      path: '/qwirkle',
      redirect: '/tally'
    },
    {
      path: '/star-realms',
      name: 'star-realms',
      component: () => import('../views/StarRealmsGame.vue')
    },
    {
      path: '/star-realms-academy',
      name: 'star-realms-academy',
      component: () => import('../views/StarRealmsAcademyGame.vue')
    },
    {
      path: '/yahtzee',
      name: 'yahtzee',
      component: () => import('../views/YahtzeeGame.vue')
    }
  ]
})

export default router
