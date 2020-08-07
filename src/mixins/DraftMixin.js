import { debounce } from "lodash-es";

export default {
  props: {
    title: String,
    content: String,
  },
  data() {
    return {
      selected: {
        id: null,
        date: null,
        title: "",
        content: "",
      },
      debouncedUpdate: debounce(this._updateOrSave, 1500),
    };
  },
  watch: {
    content(newContent, oldContent) {
      if (!oldContent || !newContent) {
        // !oldContent: ignore the first update, to avoid saving a draft of
        // content that was loaded in after this component is mounted.
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
    _updateOrSave() {
      if (!this.content) {
        // don't save an empty draft
        return;
      }
      (this.selected.id ? this.update : this.save)().then(() => {
        this.$emit("draft:saved");
      });
    },
    cancelUpdate() {
      this.debouncedUpdate.cancel();
    },
    select(draft) {
      this.selected = Object.assign({}, this.selected, draft);
      this.cancelUpdate();

      this.$emit("update:title", this.selected.title);
      this.$emit("update:content", this.selected.content);
    },
    newDraft() {
      this.select({
        id: null,
        date: null,
        title: "",
        content: "",
      });
    },
    deleteSelected() {
      if (this.selected.id) {
        this.delete(this.selected);
      }
    },
    confirmDelete(draft) {
      if (
        window.confirm(`\
Are you sure you want to delete the draft?

Contents:

${draft.content}`)
      ) {
        return this.delete(draft);
      }
    },
  },
  beforeDestroy() {
    this.debouncedUpdate.flush();
  },
};
