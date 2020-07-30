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
  if (!password || !userData.author.wrapped_key) {
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
      console.error(error);
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
  async login({ dispatch }, { username, password }) {
    return apollo
      .mutate({
        mutation: authenticate,
        variables: {
          username,
          password: await getHashedPassword(password),
        },
      })
      .then(() => {
        dispatch("updateToken", Cookies.get("jwt.header.payload"));
      });
  },
  async updateProfile({ state }, { password, name, username, new_password }) {
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
    return apollo.mutate({
      mutation: updateAuthor,
      variables: {
        input,
      },
    });
  },
  logout({ commit }) {
    commit("CLEAR_AUTH_DATA");
  },
};
