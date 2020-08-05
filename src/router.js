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
      beforeEnter(to, from, next) {
        store.dispatch("logout");
        next(from.meta && from.meta.auth ? { name: "main" } : from);
      },
    },
    {
      path: "/blog",
      component: MainLayout,
      children: [
        {
          path: "new",
          name: "blog:new",
          meta: { auth: true },
          component: () => import("./views/BlogPostNew.vue"),
        },
        {
          path: ":id/edit",
          name: "blog:edit",
          meta: { auth: true },
          component: () => import("./views/BlogPostEdit.vue"),
        },
      ],
    },
    {
      path: "/journal",
      component: MainLayout,
      beforeEnter: (to, from, next) => {
        if (
          store.getters.userData.author.wrapped_key &&
          !store.getters.masterKey
        ) {
          // masterKey not decrypted, so redirect to login page so password
          // is retrieved and it can be decrypted
          next({ name: "login", query: { redirect: to.path, forced: true } });
        } else {
          next();
        }
      },
      children: [
        {
          path: "new",
          name: "journal:new",
          meta: { auth: true },
          component: () => import("./views/JournalEntryNew.vue"),
        },
        {
          path: ":id/edit",
          name: "journal:edit",
          meta: { auth: true },
          props: true,
          component: () => import("./views/JournalEntryEdit.vue"),
        },
        {
          path: ":id",
          name: "journal:entry",
          meta: { auth: true },
          props: true,
          component: () => import("./views/JournalEntryView.vue"),
        },
        {
          path: "",
          name: "journal:view",
          meta: { auth: true },
          component: () => import("./views/JournalView.vue"),
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

Router.prototype.redirectOrMain = function() {
  if (this.currentRoute.query.redirect) {
    this.push({ path: this.currentRoute.query.redirect });
  } else {
    this.push({ name: "main" });
  }
};

router.beforeEach((to, from, next) => {
  if (store.getters.loggedIn) {
    if (to.name === "login" && !to.query.forced) {
      next({ name: "main" });
    } else {
      next();
    }
  } else if (to.meta.auth) {
    next({ name: "login", query: { redirect: to.path } });
  } else {
    next();
  }
});

export default router;
