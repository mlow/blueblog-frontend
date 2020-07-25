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
import { formatDate } from "@/util";
import Collapsible from "./Collapsible.vue";
import ContentEditChanges from "./ContentEditChanges.vue";

export default {
  props: {
    edits: Array,
  },
  methods: {
    formatDate: (date) => formatDate(date, "MMMM D, YYYY - h:mm A"),
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
