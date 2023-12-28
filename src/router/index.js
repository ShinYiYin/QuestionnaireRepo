import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Questionnaire_front',
      component: () => import('../views/Questionnaire_front.vue')
    },
    {
      path: '/questionnaire_back',
      name: 'questionnaire_back',
      component: () => import('../views/Questionnaire_back.vue')
    },
    {
      path: "/feedback/:qnId",
      name: "feedback",
      component: () => import('../views/Feedback.vue'),
    },
    {
      path: "/statistics/:qnId",
      name: "statistics",
      component: () => import('../views/Statistics.vue'),
    },
  ]
})

export default router
