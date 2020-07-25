<template>
  <collapsible v-if="drafts.length" class="drafts" label="Drafts">
    <ul class="draft-list">
      <li v-for="draft in drafts" :key="draft.id">
        <collapsible :label="label(draft)">
          <div class="draft-controls">
            <button type="button" @click="selectDraft(draft)">Edit</button>
            <button type="button" @click="deleteDraft(draft)">Delete</button>
          </div>
          <Markdown :source="draft.content" />
        </collapsible>
      </li>
    </ul>
    <button type="button" @click="newDraft">New</button>
  </collapsible>
</template>

<script>
import { debounce } from "lodash-es";
import { formatDate } from "@/util";

import {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
} from "../graphql/draft.gql";

import Collapsible from "./Collapsible.vue";
import Markdown from "./Markdown.vue";

export default {
  props: {
    draft: Object,
    selectFirstLoaded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drafts: [],
      selected: {
        id: null,
        date: null,
        title: null,
        content: null,
      },
      debouncedUpdate: debounce(this.updateOrSaveDraft, 1500),
    };
  },
  watch: {
    "draft.content"(newContent, oldContent) {
      if (!oldContent || !newContent) {
        // !oldContent: ignore the first update, to avoid saving a draft of
        // content that was loaded in after the DraftList component was created.
        // also ignores the first keystroke of actual user input
        // !newContent: don't save an empty draft
        return;
      }
      if (this.selected.content === newContent) {
        // this is the selected draft being sent back to us, ignore
        return;
      }
      this.debouncedUpdate();
    },
  },
  methods: {
    label(draft) {
      const dateFormatted = formatDate(draft.date, "MMMM D, YYYY - h:mm A");
      return `${dateFormatted}: ${draft.title}`;
    },
    selectDraft(draft) {
      Object.assign(this.selected, draft);
      this.$emit("draft:selected", draft);

      this.debouncedUpdate.cancel(); // cancel any pending draft save
    },
    updateOrSaveDraft() {
      (this.selected.id ? this.updateDraft() : this.saveDraft()).then(() => {
        this.$emit("draft:saved");
      });
    },
    saveDraft() {
      console.log("Saving draft:", this.draft);
      return this.$apollo
        .mutate({
          mutation: createDraft,
          variables: {
            input: this.draft,
          },
          update(store, { data: { draft } }) {
            addDraftToStore(store, draft);
          },
        })
        .then(({ data: { draft } }) => {
          Object.assign(this.selected, draft);
        });
    },
    updateDraft() {
      console.log("Updating draft:", this.selected.id, this.draft);
      return this.$apollo.mutate({
        mutation: updateDraft,
        variables: {
          id: this.selected.id,
          input: this.draft,
        },
        update(store, { data: { draft } }) {
          addDraftToStore(store, draft);
        },
      });
    },
    deleteDraft(draft) {
      if (!confirmDraftDelete(draft)) {
        return;
      }
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
            this.selectDraft({
              id: null,
              date: null,
              title: "",
              content: "",
            });
          }
        })
        .catch((error) => {
          window.alert(`Error deleting draft:\n${error.message}`);
        });
    },
    newDraft() {
      this.selectDraft({
        id: null,
        date: null,
        title: "",
        content: "",
      });
    },
  },
  apollo: {
    drafts: {
      query: getDrafts,
      update({ drafts: { edges } }) {
        return edges.map(({ draft }) => draft);
      },
      result({
        data: {
          drafts: { edges },
        },
      }) {
        if (edges.length > 0 && this.selectFirstLoaded && !this.selected.id) {
          const [{ draft }] = edges;
          this.selectDraft(draft);
        }
      },
    },
  },
  beforeDestroy() {
    this.debouncedUpdate.flush();
  },
  components: {
    Collapsible,
    Markdown,
  },
};

function confirmDraftDelete(draft) {
  return window.confirm(`\
Are you sure you want to delete the draft?

Contents:

${draft.content}`);
}

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
</script>

<style lang="scss" scoped>
.draft-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.rendered-markdown {
  margin: 0 0.5rem;
  outline: dashed 1px red;
  outline-offset: 0.5rem;
}

.drafts {
  button {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    margin-right: 0.25rem;
  }
}
</style>
