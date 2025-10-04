import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('../views/AnalysisView.vue')
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('../views/ResultsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
