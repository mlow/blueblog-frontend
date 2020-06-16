import Vue from "vue";
import Router from "vue-router";

import store from "./store/store";

import LoginView from "./views/LoginView.vue";
import MainView from "./views/MainView.vue";
import ProfileView from "./views/ProfileView.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "",
      name: "main",
      component: MainView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter() {
        store.dispatch("logout");
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (store.getters.loggedIn && to.name == "login") {
    next({ name: "" });
  }
  next();
});

export default router;
