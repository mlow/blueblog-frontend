<template>
  <Collapsible v-if="drafts.length" class="drafts" label="Drafts">
    <ul class="draft-list">
      <li v-for="draft in drafts" :key="draft.id">
        <Collapsible :label="draft.label">
          <div class="draft-controls">
            <button type="button" @click="$emit('draft:select', draft)">
              Edit
            </button>
            <button type="button" @click="$emit('draft:delete', draft)">
              Delete
            </button>
          </div>
          <Markdown :source="draft.content" />
        </Collapsible>
      </li>
    </ul>
    <button type="button" @click="$emit('draft:new')">New</button>
  </Collapsible>
</template>

<script>
import Collapsible from "./Collapsible.vue";
import Markdown from "./Markdown.vue";

export default {
  props: {
    drafts: Array,
  },
  components: {
    Collapsible,
    Markdown,
  },
};
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
