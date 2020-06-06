import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store/store";
import apolloProvider from "./apollo";

import "./icons";

Vue.config.productionTip = false;

store.dispatch("initAuth");

new Vue({
  router,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
