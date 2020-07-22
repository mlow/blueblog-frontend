<template>
  <div class="edits">
    <span
      :class="expanded ? 'expanded' : 'collapsed'"
      @click="expanded = !expanded"
    >Edits</span>
    <ul v-if="expanded">
      <ContentEditListItem v-for="edit in edits" :key="edit.id" :edit="edit" />
    </ul>
  </div>
</template>

<script>
import ContentEditListItem from "./ContentEditListItem";

export default {
  data() {
    return {
      expanded: false,
    };
  },
  props: {
    edits: Array,
  },
  components: {
    ContentEditListItem,
  },
};
</script>

<style lang="scss">
div.edits {
  > span {
    cursor: pointer;
  }
  ul {
    padding: 0;
    margin: 0 0 0 0.5rem;
    list-style: none;

    li {
      > span {
        cursor: pointer;
      }
      > .content {
        padding: 0 1rem;
      }
    }
  }
  .collapsed:before {
    content: "▸ ";
  }
  .expanded:before {
    content: "▾ ";
  }
}
</style>
