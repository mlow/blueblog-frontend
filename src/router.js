import Vue from "vue";
import Router from "vue-router";
import store from "./store/store";

import MainLayout from "./layouts/MainLayout.vue";
import CenterFormLayout from "./layouts/CenterFormLayout.vue";
import BlogPostView from "./views/BlogPostView.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      component: CenterFormLayout,
      children: [
        {
          path: "",
          name: "login",
          component: () => import("./views/LoginView.vue"),
        },
      ],
    },
    {
      path: "/profile",
      component: CenterFormLayout,
      children: [
        {
          path: "",
          name: "profile",
          component: () => import("./views/ProfileView.vue"),
        },
      ],
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter() {
        store.dispatch("logout");
      },
    },
    {
      path: "/blog",
      component: MainLayout,
      children: [
        {
          path: "new",
          name: "blog:new",
          component: () => import("./views/BlogPostNew.vue"),
        },
        {
          path: ":id/edit",
          name: "blog:edit",
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

Router.prototype.goBackOrMain = function() {
  if (window.history.length > 1) {
    this.go(-1);
  } else {
    this.push({ name: "main" });
  }
};

router.beforeEach((to, from, next) => {
  if (store.getters.loggedIn && to.name == "login") {
    next({ name: "main" });
  }
  next();
});

export default router;
