<template>
  <article class="post" @mouseover="hovered = true" @mouseleave="hovered = false">
    <header>
      <div>
        <h2 class="title">{{ post.title }}</h2>
      </div>
      <div class="publish_date">{{ publish_date_formatted }}</div>
    </header>
    <div class="content">
      <VueMarkdown :source="post.content"></VueMarkdown>
    </div>
    <PostEditList v-if="post.edits.length && this.owns_post" :edits="post.edits" />
  </article>
</template>

<script>
import date from "date-and-time";
import VueMarkdown from "vue-markdown";
import PostEditList from "./PostEditList";

export default {
  data() {
    return {
      hovered: false
    };
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    post: {
      type: Object,
      default() {
        return {
          id: undefined,
          title: "",
          content: "",
          publish_date: new Date(),
          edits: []
        };
      }
    }
  },
  computed: {
    publish_date_formatted() {
      return date.format(this.post.publish_date, "ddd, MMM D, YYYY");
    },
    owns_post() {
      return (
        this.$store.getters.loggedIn &&
        this.$store.getters.userData.sub == this.post.author.id
      );
    }
  },
  components: {
    VueMarkdown,
    PostEditList
  }
};
</script>

<style lang="scss">
article.post {
  font-family: "GL Erekles Stamba";
  margin: 3em 0;

  header {
    .title {
      display: inline;
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

  > div.content {
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
