<template>
  <div class="rendered-markdown" v-html="rendered" />
</template>

<script>
import markdownIt from "markdown-it";

const md = new markdownIt({
  linkify: true,
  typographer: true,
})
  .use(require("markdown-it-abbr"))
  .use(require("markdown-it-deflist"))
  .use(require("markdown-it-emoji"))
  .use(require("markdown-it-footnote"))
  .use(require("markdown-it-ins"))
  .use(require("markdown-it-mark"))
  .use(require("markdown-it-sub"))
  .use(require("markdown-it-sup"))
  .use(require("markdown-it-task-lists"));

export default {
  props: {
    source: String,
  },
  computed: {
    rendered() {
      return md.render(this.source);
    },
  },
};
</script>
