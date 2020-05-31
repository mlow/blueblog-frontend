<template>
  <article>
    <header>
      <h2 class="title">{{ title }}</h2>
      <span class="publish_date">{{ publish_date.toLocaleDateString() }}</span>
    </header>
    <div class="content">
      <VueMarkdown :source="content"></VueMarkdown>
    </div>
  </article>
</template>

<script>
import VueMarkdown from "vue-markdown";

export default {
  props: {
    title: String,
    content: String,
    publish_date: Date
  },
  components: {
    VueMarkdown
  }
};
</script>

<style lang="scss" scoped>
</style>
