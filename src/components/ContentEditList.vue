<template>
  <collapsible label="Edits">
    <ul class="edit-list">
      <li v-for="edit in edits" :key="edit.id">
        <collapsible :label="formatDate(edit.date)">
          <ContentEditChanges :edit_id="edit.id" />
        </collapsible>
      </li>
    </ul>
  </collapsible>
</template>

<script>
import date from "date-and-time";
import Collapsible from "./Collapsible.vue";
import ContentEditChanges from "./ContentEditChanges.vue";

export default {
  props: {
    edits: Array,
  },
  methods: {
    formatDate(to_format) {
      return date.format(
        to_format instanceof Date ? to_format : new Date(to_format),
        "MMMM D, YYYY - h:mm A"
      );
    },
  },
  components: {
    Collapsible,
    ContentEditChanges,
  },
};
</script>

<style lang="scss" scoped>
ul.edit-list {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
