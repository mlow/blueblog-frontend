import Vue from 'vue';
import VueApollo from 'vue-apollo'
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import Cookies from 'js-cookie';

Vue.use(VueApollo);

const cache = new InMemoryCache();

export const apollo = new ApolloClient({
    link: createHttpLink({
        // You should use an absolute URL here
        uri: '/graphql',
        credentials: "include",
        fetch: (uri, options) => {
            let token = Cookies.get('jwt.header.payload');
            if (token) {
                options.headers.Authorization = 'Bearer ' + token;
            }
            return fetch(uri, options);
        }
    }),
    cache
});

export default new VueApollo({
    defaultClient: apollo,
});
