<template>
  <article>
    <header>
      <h2 class="title">{{ title }}</h2>
      <span class="publish_date">{{ publish_date_formatted }}</span>
    </header>
    <div class="content">
      <VueMarkdown :source="content"></VueMarkdown>
    </div>
  </article>
</template>

<script>
import VueMarkdown from "vue-markdown";
import date from "date-and-time";

export default {
  props: {
    title: String,
    content: String,
    publish_date: Date
  },
  computed: {
    publish_date_formatted() {
      return date.format(this.publish_date, "ddd, MMM D, YYYY");
    }
  },
  components: {
    VueMarkdown
  }
};
</script>

<style lang="scss" scoped>
</style>
