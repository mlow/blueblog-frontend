import { GetPost, GetPosts } from "@/graphql/blog_post.gql";
import { apollo } from "@/apollo";

export const namespaced = true;

export const state = () => ({
  // a listing of cached blog posts from most recent to oldest
  posts: [],
  index: 0,
});

export const getters = {
  byIndex: (state) => (index) => state.posts[index],
  byID: (state) => (id) => {
    return state.posts.find((post) => post.id === id);
  },
  current: (state) => state.posts[state.index],
  previous: (state) => state.posts[state.index - 1],
  next: (state) => state.posts[state.index + 1],
};

export const mutations = {
  CLEAR(state) {
    state.posts.splice(0);
    state.index = 0;
  },
  DELETE(state) {
    state.posts.splice(state.index, 1);
    if (state.index > 0) {
      state.index--;
    }
  },
  SET(state, { post, index }) {
    if (index < 0) {
      state.posts.unshift(post);
      state.index++;
    } else {
      state.posts.splice(index, 1, post);
    }
  },
  TRIM_BEFORE(state, index) {
    state.posts.splice(0, index);
  },
  TRIM_AFTER(state, index) {
    state.posts.splice(index + 1);
  },
  SET_INDEX(state, index) {
    state.index = index;
  },
};

function fromResp(post) {
  post.publish_date = new Date(post.publish_date);
  return post;
}

export const actions = {
  delete({ commit }) {
    commit("DELETE");
  },
  incIndex({ commit, state, dispatch }) {
    commit("SET_INDEX", state.index + 1);
    dispatch("updateAdjacent");
  },
  decIndex({ commit, state, dispatch }) {
    commit("SET_INDEX", state.index - 1);
    dispatch("updateAdjacent");
  },
  updateAdjacent({ commit, state, getters }) {
    // fetches the posts adjacent to the index
    const before = !getters.previous;
    const after = !getters.next;
    if (!(before || after)) {
      return;
    }
    apollo
      .query({
        query: GetPosts,
        variables: {
          cursor: getters.current.cursor,
          before: before ? 1 : 0,
          after: after ? 1 : 0,
        },
        fetchPolicy: "no-cache",
      })
      .then(
        ({
          data: {
            blog_posts: {
              beforeEdges: [previous],
              afterEdges: [next],
            },
          },
        }) => {
          if (previous !== undefined) {
            commit("SET", {
              post: fromResp(previous.node),
              index: state.index - 1,
            });
          } else if (before) {
            commit("TRIM_BEFORE", state.index);
          }
          if (next !== undefined) {
            commit("SET", {
              post: fromResp(next.node),
              index: state.index + 1,
            });
          } else if (after) {
            commit("TRIM_AFTER", state.index);
          }
        }
      )
      .catch((error) => {
        console.log(error);
      });
  },
  fetchLatest({ commit }) {
    return apollo
      .query({
        query: GetPosts,
        variables: {
          before: 0,
          after: 2,
        },
        fetchPolicy: "no-cache",
      })
      .then(
        ({
          data: {
            blog_posts: {
              afterEdges: [firstPost, nextPost],
            },
          },
        }) => {
          commit("CLEAR");
          if (firstPost !== undefined) {
            commit("SET", { post: fromResp(firstPost.node), index: 0 });
          }
          if (nextPost !== undefined) {
            commit("SET", { post: fromResp(nextPost.node), index: 1 });
          }
        }
      )
      .catch((error) => {
        alert(`Error fetching post: ${error.message}`);
      });
  },
  async fetchByID(
    { commit, dispatch, state },
    { id, cacheAndUpdateIndex = true }
  ) {
    const indexOf = state.posts.findIndex((post) => id === post.id);
    if (indexOf >= 0) {
      if (cacheAndUpdateIndex) {
        commit("SET_INDEX", indexOf);
        dispatch("updateAdjacent");
      }
      return Promise.resolve(state.posts[indexOf]);
    }
    return apollo
      .query({
        query: GetPost,
        variables: { id },
        fetchPolicy: "no-cache",
      })
      .then(({ data: { blog_post: post } }) => {
        if (cacheAndUpdateIndex) {
          commit("CLEAR");
          commit("SET", { post: fromResp(post), index: 0 });
          dispatch("updateAdjacent");
        }
        return fromResp(post);
      })
      .catch((error) => {
        alert(`Error fetching post by ID ${id}: ${error.message}`);
      });
  },
};
