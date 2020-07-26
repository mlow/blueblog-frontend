<template>
  <Collapsible v-if="drafts.length" class="drafts" label="Drafts">
    <ul class="draft-list">
      <li v-for="draft in drafts" :key="draft.id">
        <Collapsible :label="label(draft)">
          <div class="draft-controls">
            <button type="button" @click="selectDraft(draft)">Edit</button>
            <button type="button" @click="deleteDraft(draft)">Delete</button>
          </div>
          <Markdown :source="draft.content" />
        </Collapsible>
      </li>
    </ul>
    <button type="button" @click="newDraft">New</button>
  </Collapsible>
</template>

<script>
import { debounce } from "lodash-es";
import { mapGetters, mapActions } from "vuex";
import { formatDate } from "@/util";

import { getDrafts } from "../graphql/draft.gql";

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
      debouncedUpdate: debounce(this.updateOrSaveDraft, 1500),
    };
  },
  computed: {
    ...mapGetters("draft", ["selected"]),
  },
  watch: {
    selected() {
      this.emitSelection();

      // when a new draft is selected, cancel any pending updates that may
      // overwrite it.
      this.debouncedUpdate.cancel();
    },
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
    ...mapActions("draft", { selectDraft: "select" }),
    label(draft) {
      const dateFormatted = formatDate(draft.date, "YYYY-MM-DD HH:mm");
      return `${dateFormatted} ${draft.title ? " | " + draft.title : ""}`;
    },
    emitSelection() {
      this.$emit("draft:selected", {
        title: this.selected.title,
        content: this.selected.content,
      });
    },
    updateOrSaveDraft() {
      this.$store
        .dispatch("draft/updateOrSave", this.draft)
        .then(() => this.$emit("draft:saved"));
    },
    deleteDraft(draft) {
      if (!confirmDraftDelete(draft)) {
        return;
      }
      this.$store
        .dispatch("draft/delete", draft)
        .catch((error) =>
          window.alert(`Error deleting draft:\n${error.message}`)
        );
    },
    newDraft() {
      this.$store.dispatch("draft/select", {
        id: null,
        date: null,
        title: "",
        content: "",
      });
    },
  },
  created() {
    if (this.selected.id) {
      this.emitSelection();
    }
  },
  apollo: {
    drafts: {
      query: getDrafts,
      update({ drafts: { edges } }) {
        return edges
          .map(({ draft }) => ({
            ...draft,
            date: new Date(draft.date),
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime());
      },
      result({
        data: {
          drafts: { edges },
        },
      }) {
        if (edges.length > 0 && this.selectFirstLoaded && !this.selected.id) {
          const [{ draft }] = edges;
          this.$store.dispatch("draft/select", draft);
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
