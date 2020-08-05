<template>
  <DraftList
    :drafts="drafts"
    @draft:select="select"
    @draft:delete="confirmDelete"
    @draft:new="newDraft"
  />
</template>

<script>
import { formatDate } from "@/util";
import {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
} from "../graphql/draft.gql";
import DraftMixin from "../mixins/DraftMixin";
import DraftList from "./DraftList";

export default {
  mixins: [DraftMixin],
  props: {
    selectFirstLoaded: Boolean,
  },
  data() {
    return {
      drafts: [],
    };
  },
  methods: {
    save() {
      return this.$apollo
        .mutate({
          mutation: createDraft,
          variables: {
            input: { title: this.title, content: this.content },
          },
          update(store, { data: { draft } }) {
            addDraftToStore(store, draft);
          },
        })
        .then(({ data: { draft } }) => this.select(draft));
    },
    update() {
      return this.$apollo.mutate({
        mutation: updateDraft,
        variables: {
          id: this.selected.id,
          input: { title: this.title, content: this.content },
        },
        update(store, { data: { draft } }) {
          addDraftToStore(store, draft);
        },
      });
    },
    delete(draft) {
      return this.$apollo
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
          if (this.selected.id === id) {
            this.newDraft();
          }
        });
    },
  },
  apollo: {
    drafts: {
      query: getDrafts,
      update({ drafts: { edges } }) {
        return edges
          .map(({ draft }) => {
            const date = new Date(draft.date);
            const formatted = formatDate(date, "YYYY-MM-DD HH:mm");
            const title = draft.title ? " | " + draft.title : "";
            return {
              ...draft,
              date,
              label: formatted + title,
            };
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime());
      },
      result({
        data: {
          drafts: { edges },
        },
      }) {
        if (edges.length > 0 && this.selectFirstLoaded && !this.selected.id) {
          const [{ draft }] = edges;
          this.select(draft);
        }
      },
    },
  },
  components: {
    DraftList,
  },
};

function addDraftToStore(store, draft) {
  const data = store.readQuery({ query: getDrafts });
  const existingDraft = data.drafts.edges.find(
    ({ draft: existing }) => existing.id === draft.id
  );
  if (existingDraft) {
    Object.assign(existingDraft.draft, draft);
  } else {
    data.drafts.edges.unshift({
      __typename: "DraftEdge",
      draft,
    });
  }
  store.writeQuery({ query: getDrafts, data });
}
</script>
