import Vue from 'vue';
import Router from 'vue-router';
import LoginView from './views/LoginView.vue';
import MainView from './views/MainView.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '',
      name: 'main',
      component: MainView,
    },
  ],
});

export default router;
