<template>
  <article
    class="post"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <header>
      <div>
        <h2 class="title">{{ title || dateFormatted }}</h2>
        <span v-show="hovered" class="content-controls">
          <slot name="controls"></slot>
        </span>
      </div>
      <div v-if="title" class="date">{{ dateFormatted }}</div>
    </header>
    <Markdown class="content" v-if="render" :source="content" />
    <div v-else class="content rendered-markdown" v-html="content" />
  </article>
</template>

<script>
import { locale } from "../util";

export default {
  props: {
    date: [Date, String],
    title: String,
    content: String,
    render: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hovered: false,
    };
  },
  computed: {
    dateFormatted() {
      return locale.longDate(this.date);
    },
  },
  components: {
    Markdown: () => import(/* webpackChunkName: "markdown" */ "./Markdown.vue"),
  },
};
</script>

<style lang="scss" scoped>
.post {
  margin: 1.5rem 0;

  header {
    .title {
      display: inline;
      margin: 0;
      font-size: 2rem;
      font-family: "Amperzand";
      font-weight: bold;
    }

    .content-controls > * {
      margin-left: 0.5rem;
    }

    .date {
      font-size: 0.9rem;
      font-style: italic;
    }
  }

  > .content {
    overflow-wrap: break-word;
    padding: 0 0.6875rem;
  }
}
</style>
