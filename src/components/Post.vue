<template>
  <article
    class="post"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <header>
      <div>
        <h2 class="title">{{ post.title }}</h2>
        <span v-if="owns_post" v-show="hovered" class="post-controls">
          <Icon icon="edit" @click="$emit('edit', post)" />
          <Icon icon="delete" @click="$emit('delete', post)" />
        </span>
      </div>
      <div class="publish_date">{{ publish_date_formatted }}</div>
    </header>
    <div class="content">
      <VueMarkdown :source="post.content"></VueMarkdown>
    </div>
    <PostEditList
      v-if="post.edits && post.edits.length && this.owns_post"
      :edits="post.edits"
    />
  </article>
</template>

<script>
import date from "date-and-time";
import VueMarkdown from "vue-markdown";
import Icon from "./Icon";
import PostEditList from "./PostEditList";

export default {
  data() {
    return {
      hovered: false,
    };
  },
  props: {
    post: {
      type: Object,
    },
  },
  computed: {
    publish_date_formatted() {
      return date.format(this.post.publish_date, "D MMMM YYYY");
    },
    owns_post() {
      return (
        this.$store.getters.loggedIn &&
        this.$store.getters.userData.sub == this.post.author.id
      );
    },
  },
  components: {
    Icon,
    VueMarkdown,
    PostEditList,
  },
};
</script>

<style lang="scss">
article.post {
  font-family: "GL Erekles Stamba";
  margin: 3rem 0;

  header {
    .title {
      display: inline;
      margin: 0;
      font-size: 2rem;
      font-family: "Amperzand";
      font-weight: bold;
    }

    .post-controls > * {
      margin-left: 0.5rem;
    }

    .publish_date {
      font-size: 0.9rem;
      font-style: italic;
    }
  }

  > div.content {
    //
    padding: 0 0.6875rem;

    blockquote {
      background: rgba(#777, 0.2);
      border-left: 0.5rem solid #777;
      color: #43484d;
      margin: 1rem 0;
      padding: 0 1rem;
    }

    pre {
      background: rgba(#777, 0.2);
      padding: 1rem;
    }

    code {
      width: 100%;
    }
  }
}
</style>
