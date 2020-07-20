import Vue from "vue";
import Router from "vue-router";
import store from "./store/store";

import MainLayout from "./layouts/MainLayout.vue";
import BlogPostView from "./views/BlogPostView.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("./views/LoginView.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/ProfileView.vue"),
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter() {
        store.dispatch("logout");
      },
    },
    {
      path: "/edit",
      component: MainLayout,
      children: [
        {
          path: ":id",
          name: "edit",
          component: () => import("./views/BlogPostEdit.vue"),
        },
      ],
    },
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "/:id?/:slug?",
          name: "main",
          component: BlogPostView,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (store.getters.loggedIn && to.name == "login") {
    next({ name: "main" });
  }
  next();
});

export default router;
