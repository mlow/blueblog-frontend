<template>
  <article
    class="post"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <header>
      <div>
        <h2 class="title">{{ title }}</h2>
        <span v-show="hovered" class="content-controls">
          <slot name="controls"></slot>
        </span>
      </div>
      <div class="date">{{ date_formatted }}</div>
    </header>
    <Markdown v-if="render" :source="content" />
    <div v-else class="content rendered-markdown" v-html="content" />
  </article>
</template>

<script>
import { formatDate } from "@/util";

export default {
  props: {
    date: [Date, String],
    dateFormat: {
      type: String,
      default: "MMMM D, YYYY",
    },
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
    date_formatted() {
      return formatDate(this.date, this.dateFormat);
    },
  },
  components: {
    Markdown: () => import("./Markdown.vue"),
  },
};
</script>

<style lang="scss" scoped>
.post {
  margin-top: 2rem;

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
    padding: 0 0.6875rem;
  }
}
</style>
