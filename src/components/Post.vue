<template>
  <article class="post">
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

<style lang="scss">
article.post {
  font-family: "GL Erekles Stamba";
  margin: 3em 0;

  header {
    h2.title {
      margin: 0;
      font-size: 2em;
      font-family: "Amperzand";
      font-weight: bold;
    }
    .publish_date {
      font-size: 0.9em;
      font-style: italic;
    }
  }

  div.content {
    padding: 0 11px;

    blockquote {
      background: rgba(#777, 0.2);
      border-left: 10px solid #777;
      color: #43484d;
      margin: 1em 0em;
      padding: 0 1em;
    }

    pre {
      background: rgba(#777, 0.2);
      padding: 1em;
    }

    code {
      width: 100%;
    }
  }
}
</style>
