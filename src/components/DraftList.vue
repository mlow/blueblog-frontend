<template>
  <collapsible label="Drafts">
    <ul class="draft-list">
      <li v-for="draft in drafts" :key="draft.id">
        <collapsible :label="label(draft)">
          <Markdown :source="draft.content" />
        </collapsible>
      </li>
    </ul>
  </collapsible>
</template>

<script>
import { debounce } from "lodash-es";
import { formatDate } from "@/util";

import { getDrafts, createDraft, updateDraft } from "../graphql/draft.gql";

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
        if (edges.length > 0 && this.selectFirstLoaded) {
          const [{ draft }] = edges;
          this.selectDraft(draft);
        }
      },
    },
  },
  mounted() {
    this.debouncedUpdate = debounce(this.updateOrSaveDraft, 2500);
  },
  beforeDestroy() {
    this.debouncedUpdate.flush();
  },
  components: {
    Collapsible,
    Markdown,
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
</script>

<style lang="scss" scoped>
ul.draft-list {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
