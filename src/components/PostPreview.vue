<template>
  <Post
    :title="draft_title"
    :content="draft_content"
    :date="publish_date"
    :render="true"
  />
</template>

<script>
import Post from "./Post.vue";

export default {
  props: {
    title: String,
    content: String,
    publish_date: Date,
  },
  computed: {
    draft_title() {
      return this.title || "Title";
    },
    draft_content() {
      return this.content || "Write your thoughts...";
    },
  },
  components: {
    Post,
  },
};
</script>
