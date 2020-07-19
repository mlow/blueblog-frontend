import Cookies from "js-cookie";
import JwtDecode from "jwt-decode";
import { apollo } from "@/apollo";
import gql from "graphql-tag";

export const state = () => ({
  jwt: null,
  userData: null,
});

export const getters = {
  loggedIn: (state) => {
    return !!state.userData && state.userData.exp * 1000 > Date.now();
  },
  jwt: (state) => state.jwt,
  userData: (state) => state.userData,
};

export const mutations = {
  UPDATE_AUTH_DATA(state, jwt) {
    state.jwt = jwt;
    state.userData = JwtDecode(jwt);
  },
  CLEAR_AUTH_DATA(state) {
    state.jwt = null;
    state.userData = null;
    Cookies.remove("jwt.header.payload");
  },
};

const auth_query = gql`
  mutation authenticate($username: String!, $password: String!) {
    authenticate(username: $username, password: $password)
  }
`;

export const actions = {
  updateToken({ commit }, jwt) {
    commit("UPDATE_AUTH_DATA", jwt);
  },
  initAuth({ dispatch }) {
    let jwtPayload = Cookies.get("jwt.header.payload");
    if (jwtPayload) {
      dispatch("updateToken", jwtPayload);
    }
  },
  login({ dispatch }, { username, password }) {
    return apollo
      .mutate({
        mutation: auth_query,
        variables: { username, password },
      })
      .then(() => {
        dispatch("updateToken", Cookies.get("jwt.header.payload"));
      });
  },
  logout({ commit }) {
    commit("CLEAR_AUTH_DATA");
  },
};
