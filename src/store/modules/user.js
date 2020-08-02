import Cookies from "js-cookie";
import JwtDecode from "jwt-decode";
import { apollo } from "@/apollo";
import { authenticate, updateAuthor } from "@/graphql/auth.gql";
import { base64Encode } from "@/webcrypto";
import {
  generateMasterKey,
  wrapMasterKey,
  unwrapMasterKey,
} from "@/encryption";

const encoder = new TextEncoder();

async function getHashedPassword(password) {
  // we compute a SHA-256 digest of the user's password and base64
  // encode it before sending it to the server
  return base64Encode(
    await crypto.subtle.digest("SHA-256", encoder.encode(password))
  );
}

async function generateOrRewrapMasterKey({ userData }, password, new_password) {
  if (!userData.author.wrapped_key) {
    return generateMasterKey(new_password);
  } else {
    try {
      return wrapMasterKey(
        new_password,
        await unwrapMasterKey(
          password,
          userData.author.key_salt,
          userData.author.wrapped_key
        )
      );
    } catch (error) {
      // this likely means we were unable to unwrap the existing key due to an
      // incorrect password. Emit the same password incorrect message as the
      // server does.
      throw new Error("Current password is incorrect.");
    }
  }
}

export const state = () => ({
  jwt: null,
  userData: null,
  masterKey: null,
});

export const getters = {
  loggedIn: (state) => {
    return !!state.userData && state.userData.exp * 1000 > Date.now();
  },
  jwt: (state) => state.jwt,
  userData: (state) => state.userData,
  masterKey: (state) => state.masterKey,
};

export const mutations = {
  SET_USER_DATA(state, { jwt, userData }) {
    state.jwt = jwt;
    state.userData = userData;
  },
  SET_MASTER_KEY(state, masterKey) {
    state.masterKey = masterKey;
  },
  CLEAR_AUTH_DATA(state) {
    state.jwt = null;
    state.userData = null;
    state.masterKey = null;
  },
};

export const actions = {
  initAuth({ commit }, jwt) {
    const _jwt = jwt || Cookies.get("jwt.header.payload");
    if (_jwt) {
      commit("SET_USER_DATA", { jwt: _jwt, userData: JwtDecode(_jwt) });
    }
  },
  unlockMasterKey({ state, commit }, password) {
    const { wrapped_key, key_salt } = state.userData.author;
    if (wrapped_key && key_salt) {
      return unwrapMasterKey(password, key_salt, wrapped_key).then((key) =>
        commit("SET_MASTER_KEY", key)
      );
    }
  },
  async login({ dispatch }, { username, password }) {
    return apollo
      .mutate({
        mutation: authenticate,
        variables: {
          username,
          password: await getHashedPassword(password),
        },
      })
      .then(() => dispatch("unlockMasterKey", password));
  },
  async updateProfile(
    { state, dispatch },
    { password, name, username, new_password }
  ) {
    const input = {
      password: await getHashedPassword(password),
      name: name || null,
      username: username || null,
    };
    if (new_password) {
      Object.assign(input, {
        new_password: await getHashedPassword(new_password),
        ...(await generateOrRewrapMasterKey(state, password, new_password)),
      });
    }
    return apollo
      .mutate({
        mutation: updateAuthor,
        variables: {
          input,
        },
      })
      .then(() => dispatch("unlockMasterKey", new_password));
  },
  logout({ commit }) {
    commit("CLEAR_AUTH_DATA");
    Cookies.remove("jwt.header.payload");
  },
};
