<template>
  <collapsible class="edits" label="Edits">
    <ul class="edit-list">
      <ContentEditListItem v-for="edit in edits" :key="edit.id" :edit="edit" />
    </ul>
  </collapsible>
</template>

<script>
import ContentEditListItem from "./ContentEditListItem";
import Collapsible from "./Collapsible.vue";

export default {
  props: {
    edits: Array,
  },
  components: {
    ContentEditListItem,
    Collapsible,
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
