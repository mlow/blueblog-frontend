import Cookies from "js-cookie";
import JwtDecode from "jwt-decode";
import { apollo } from "@/apollo";
import gql from "graphql-tag";

export const state = {
  userData: null,
};

export const getters = {
  loggedIn: (state) => {
    return !!state.userData && (state.userData.exp * 1000) > Date.now();
  },
  userData: (state) => state.userData,
};

export const mutations = {
  UPDATE_AUTH_DATA(state, { userData }) {
    state.userData = userData;
  },
  CLEAR_AUTH_DATA(state) {
    state.userData = null;
    Cookies.remove("jwt.header.payload");
  },
};

const auth_query = gql`
mutation authenticate($username: String!, $password: String!) {
  authenticate(username: $username, password: $password)
}`;

export const actions = {
  initAuth({ commit }) {
    let jwtPayload = Cookies.get("jwt.header.payload");
    if (jwtPayload) {
      commit("UPDATE_AUTH_DATA", {
        userData: JwtDecode(jwtPayload),
      });
    }
  },
  login({ commit }, { username, password }) {
    return apollo.mutate({
      mutation: auth_query,
      variables: { username, password },
    }).then(() => {
      let jwtPayload = Cookies.get("jwt.header.payload");
      commit("UPDATE_AUTH_DATA", {
        userData: JwtDecode(jwtPayload),
      });
    });
  },
  logout({ commit }) {
    commit("CLEAR_AUTH_DATA");
  },
};
