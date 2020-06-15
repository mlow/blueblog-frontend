<template>
  <div class="edits">
    <span
      :class="expanded ? 'expanded' : 'collapsed'"
      @click="expanded = !expanded"
    >Edits</span>
    <ul v-if="expanded">
      <PostEditListEntry v-for="edit in edits" :key="edit.id" :edit="edit" />
    </ul>
  </div>
</template>

<script>
import PostEditListEntry from "./PostEditListEntry";

export default {
  data() {
    return {
      expanded: false
    };
  },
  props: {
    edits: Array
  },
  components: {
    PostEditListEntry
  }
};
</script>

<style lang="scss">
div.edits {
  > span {
    cursor: pointer;
  }
  ul {
    padding: 0;
    margin: 0 0 0 0.5em;
    list-style: none;

    li {
      > span {
        cursor: pointer;
      }
      > .content {
        padding: 0 1em;
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
