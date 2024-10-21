// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  {
      path: '/',
      redirect: '/login' // Redirigir a login inicialmente
  },
  {
      path: '/main',
      component: MainLayout,
      children: [
          {
              path: '',
              name: 'home',
              component: HomeView,
            },
            {
              path: 'filemanager',
              name: 'FileManager',
              component: () => import(/* webpackChunkName: "filemanager" */ '../views/filemanager/FileManagerView.vue'),
            },
      ]
  },
  {
      path: '/login',
      name: 'login',
      component: LoginView,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
