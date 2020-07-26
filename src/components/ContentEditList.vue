<template>
  <Collapsible label="Edits">
    <ul class="edit-list">
      <li v-for="edit in edits" :key="edit.id">
        <Collapsible :label="formatDate(edit.date)">
          <ContentEditChanges :edit_id="edit.id" />
        </Collapsible>
      </li>
    </ul>
  </Collapsible>
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
    formatDate: (date) => formatDate(date, "YYYY-MM-DD HH:mm"),
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
