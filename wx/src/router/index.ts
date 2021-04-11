// import { createRouter, createWebHistory } from 'vue-router'

// // 开启历史模式
// // vue2中使用 mode: history 实现
// const routerHistory = createWebHistory();

// const router:object = createRouter({
//   history: routerHistory,
//   routes: [
//     {
//       path: '/',
//       redirect: '/home'
//     },
//     {
//       path: '/home',
//       component: () => import('../pages/Home.vue')
//     },
//     {
//       path: '/contact',
//       component: () => import('../pages/Contact.vue')
//     }
//   ]
// })

// export default router

import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('../pages/Message.vue'),
  },
  {
    path: '/solution',
    name: 'solution',
    component: () => import('../pages/solution.vue'),
  },
  {
    path: '/solution-detail',
    name: 'solution-detail',
    component: () => import('../components/Solution-detail.vue')
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
