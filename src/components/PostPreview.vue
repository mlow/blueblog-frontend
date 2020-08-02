<template>
  <article class="post">
    <header>
      <div>
        <h2 class="title">{{ draft_title }}</h2>
      </div>
      <div class="date">{{ publish_date_formatted }}</div>
    </header>
    <Markdown class="content" :source="draft_content"></Markdown>
  </article>
</template>

<script>
import { formatDate } from "@/util";
import Markdown from "./Markdown.vue";

export default {
  props: {
    title: String,
    content: String,
    publish_date: Date,
  },
  computed: {
    publish_date_formatted() {
      return formatDate(this.publish_date ?? new Date(), "MMM D, YYYY");
    },
    draft_title() {
      return this.title || "Title";
    },
    draft_content() {
      return this.content || "Write your thoughts...";
    },
  },
  components: {
    Markdown,
  },
};
</script>
