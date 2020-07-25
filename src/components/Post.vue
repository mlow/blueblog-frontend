<template>
  <article
    class="post"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <header>
      <div>
        <h2 class="title">{{ post.title }}</h2>
        <span v-if="ownsPost" v-show="hovered" class="post-controls">
          <Icon
            icon="edit"
            :route="{ name: 'blog:edit', params: { id: post.id } }"
          />
          <Icon icon="delete" @click="this.delete" />
        </span>
      </div>
      <div class="publish_date">{{ publish_date_formatted }}</div>
    </header>
    <div class="content rendered-markdown" v-html="post.content" />
    <ContentEditList v-if="ownsPost && edits.length > 0" :edits="edits" />
  </article>
</template>

<script>
import { formatDate } from "@/util";
import Icon from "./Icon";
import { DeletePost, GetPostEdits } from "../graphql/blog_post.gql";

export default {
  data() {
    return {
      hovered: false,
      edits: [],
    };
  },
  props: {
    post: {
      type: Object,
    },
  },
  computed: {
    publish_date_formatted() {
      return formatDate(this.post.publish_date, "MMMM D, YYYY");
    },
    ownsPost() {
      return (
        this.$store.getters.loggedIn &&
        this.$store.getters.userData.sub == this.post.author_id
      );
    },
  },
  methods: {
    delete() {
      if (
        !window.confirm(`\
You are about to delete the post:

    ${this.post.title}

Are you sure?`)
      ) {
        return;
      }
      this.$apollo
        .mutate({
          mutation: DeletePost,
          variables: {
            id: this.post.id,
          },
        })
        .then(() => {
          this.$emit("deleted");
        })
        .catch((error) => alert(error));
    },
  },
  apollo: {
    edits: {
      query: GetPostEdits,
      variables() {
        return {
          id: this.post.id,
        };
      },
      skip() {
        return !this.ownsPost;
      },
      update: ({ blog_post: { edits } }) => edits,
    },
  },
  components: {
    Icon,
    ContentEditList: () => import("../components/ContentEditList"),
  },
};
</script>

<style lang="scss">
.post {
  margin: 2.5rem 1.5rem;

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

  > .content {
    //
    padding: 0 0.6875rem;
  }
}
</style>
