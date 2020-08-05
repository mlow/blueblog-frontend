import Vue from "vue";
import Vuex from "vuex";

import * as user from "./modules/user";
import * as blog_post from "./modules/blog_post";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    blog_post,
  },
});
