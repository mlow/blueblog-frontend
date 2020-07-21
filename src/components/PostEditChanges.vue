<template>
  <div class="changes" v-html="changes_formatted" />
</template>

<script>
import { getEditChanges } from "../graphql/edit.gql";

export default {
  data() {
    return {
      edit: {
        changes: [],
      },
    };
  },
  props: {
    edit_id: String,
  },
  computed: {
    changes_formatted() {
      return this.edit.changes
        .map((change) => {
          if (change.added) {
            return `<ins>${change.text}</ins>`;
          } else if (change.removed) {
            return `<del>${change.text}</del>`;
          } else {
            return change.text;
          }
        })
        .join("");
    },
  },
  apollo: {
    edit: {
      query: getEditChanges,
      variables() {
        return { edit_id: this.edit_id };
      },
    },
  },
};
</script>

<style lang="scss">
.changes {
  white-space: pre-wrap;
  ins {
    text-decoration: none;
    color: green;
    background: rgb(0, 128, 0, 0.2);
  }
  del {
    text-decoration: none;
    color: red;
    background: rgb(255, 0, 0, 0.2);
  }
}
</style>
