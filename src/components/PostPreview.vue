<template>
  <article class="post">
    <header>
      <div>
        <h2 class="title">{{ draft_title }}</h2>
      </div>
      <div class="publish_date">{{ publish_date_formatted }}</div>
    </header>
    <div class="content">
      <Markdown :source="draft_content"></Markdown>
    </div>
  </article>
</template>

<script>
import date from "date-and-time";
import Markdown from "./Markdown.vue";

export default {
  props: {
    title: String,
    content: String,
    publish_date: Date,
  },
  computed: {
    publish_date_formatted() {
      return date.format(this.publish_date ?? new Date(), "MMM D, YYYY");
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
