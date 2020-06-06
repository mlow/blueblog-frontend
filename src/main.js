import Vue from "vue";
import App from "./App.vue";

import VueApollo from 'vue-apollo'
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import router from "./router";
import "./icons";

Vue.config.productionTip = false;

const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:8080/graphql',
})

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.use(VueApollo);

new Vue({
  router,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
