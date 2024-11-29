//==============================================================================

import { createRouter, createMemoryHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import Annotations from '../views/Annotations.vue'

//==============================================================================

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview
    },
    {
      path: '/annotations',
      name: 'flatmaps',
      component: Annotations
    }
  ]
})

export default router

//==============================================================================
