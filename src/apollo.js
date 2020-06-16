import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import Cookies from "js-cookie";

import store from "./store/store";

Vue.use(VueApollo);

const cache = new InMemoryCache();

const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "include",
  fetch: (uri, options) => {
    const token = store.getters.jwt;
    if (token) {
      options.headers.Authorization = "Bearer " + token;
    }
    return fetch(uri, options);
  },
});

const tokenUpdateLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((data) => {
    const token = store.getters.jwt;
    if (token) {
      const cookie = Cookies.get("jwt.header.payload");
      if (cookie && cookie !== token) {
        // received new token in last response, update store with it
        store.dispatch("updateToken", cookie);
      }
    }
    return data;
  });
});

export const apollo = new ApolloClient({
  link: ApolloLink.from([tokenUpdateLink, httpLink]),
  cache,
});

export default new VueApollo({
  defaultClient: apollo,
});
