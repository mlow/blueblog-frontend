<template>
  <Collapsible label="Edits">
    <ul class="edit-list">
      <li v-for="edit in edits" :key="edit.id">
        <Collapsible :label="locale.dateAndTime(edit.date)">
          <ContentEditChanges :edit_id="edit.id" />
        </Collapsible>
      </li>
    </ul>
  </Collapsible>
</template>

<script>
import { locale } from "../util";
import Collapsible from "./Collapsible.vue";
import ContentEditChanges from "./ContentEditChanges.vue";

export default {
  props: {
    edits: Array,
  },
  methods: {
    locale,
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
