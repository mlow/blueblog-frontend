import { apollo } from "@/apollo";
import {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
} from "@/graphql/draft.gql";

export const namespaced = true;

export const state = () => ({
  selected: {
    id: null,
    date: null,
    title: "",
    content: "",
  },
});

export const getters = {
  selected: (state) => state.selected,
};

export const mutations = {
  SET_SELECTED(state, draft) {
    state.selected = Object.assign({}, state.selected, draft);
  },
};

export const actions = {
  select({ commit }, draft) {
    commit("SET_SELECTED", draft);
  },
  updateOrSave({ dispatch, state }, draft) {
    return dispatch(state.selected.id ? "update" : "save", draft);
  },
  save({ dispatch }, draft) {
    return apollo
      .mutate({
        mutation: createDraft,
        variables: {
          input: draft,
        },
        update(store, { data: { draft } }) {
          addDraftToStore(store, draft);
        },
      })
      .then(({ data: { draft } }) => dispatch("select", draft));
  },
  update({ state }, draft) {
    return apollo.mutate({
      mutation: updateDraft,
      variables: {
        id: state.selected.id,
        input: draft,
      },
      update(store, { data: { draft } }) {
        addDraftToStore(store, draft);
      },
    });
  },
  deleteSelected({ state, dispatch }) {
    if (state.selected.id) {
      return dispatch("delete", state.selected);
    }
  },
  delete({ state, dispatch }, draft) {
    return apollo
      .mutate({
        mutation: deleteDraft,
        variables: { id: draft.id },
        update(store, { data: { id } }) {
          const data = store.readQuery({ query: getDrafts });
          data.drafts.edges = data.drafts.edges.filter(
            ({ draft: existing }) => existing.id !== id
          );
          store.writeQuery({ query: getDrafts, data });
        },
      })
      .then(({ data: { id } }) => {
        if (state.selected.id === id) {
          return dispatch("select", {
            id: null,
            date: null,
            title: "",
            content: "",
          });
        }
      });
  },
};

function addDraftToStore(store, draft) {
  const data = store.readQuery({ query: getDrafts });
  const existingDraft = data.drafts.edges.find(
    ({ draft: existing }) => existing.id === draft.id
  );
  if (existingDraft) {
    Object.assign(existingDraft, draft);
  } else {
    data.drafts.edges.unshift({
      __typename: "DraftEdge",
      draft,
    });
  }
  store.writeQuery({ query: getDrafts, data });
}
