import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('../views/front/List.vue')
    },
    {
      path: '/questionnaire',
      name: 'questionnaire',
      component: () => import('../views/back/Questionnaire.vue')
    },
    {
      path: '/classmate',
      name: 'classmate',
      component: () => import('/classmate.vue')
    }
  ]
})

export default router
