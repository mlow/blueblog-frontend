<template>
  <div id="view:main">
    <span id="user-controls">
      <template v-if="loggedIn">
        <Icon icon="feather" v-show="!authoring" @click="authoring = true" />
        <Icon icon="book" />
        <Icon icon="user-profile" />
        <Icon icon="sign-out" route="/logout" />
      </template>
      <Icon v-else icon="sign-in" route="/login" />
    </span>
    <PostEditor
      v-if="authoring"
      v-bind="authoring_post"
      @cancel="authoring = false"
      @edit="edit"
      @publish="publish"
    />
    <section v-else id="posts">
      <template v-if="posts.length">
        <Post
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @edit="postEdit"
          @delete="postDelete"
        />
      </template>
      <div v-else class="nothing-to-see">Check back later!</div>
    </section>
  </div>
</template>

<script>
import PageLayout from "../layouts/PageLayout.vue";
import Icon from "../components/Icon.vue";
import Post from "../components/Post.vue";
import PostEditor from "../components/PostEditor";
import { mapGetters } from "vuex";

import {
  getPosts,
  createPost,
  editPost,
  deletePost,
} from "../graphql/posts.gql";

function emptyPost() {
  return {
    id: undefined,
    title: "",
    content: "",
    publish_date: undefined,
  };
}

export default {
  name: "Main",
  data() {
    return {
      authoring: false,
      authoring_post: emptyPost(),
      posts: [],
    };
  },
  computed: {
    ...mapGetters(["loggedIn"]),
  },
  methods: {
    postEdit(post) {
      for (let k in this.authoring_post) {
        // copy fields of clicked post to authored post
        this.authoring_post[k] = post[k];
      }
      this.authoring = true;
    },
    postDelete(post) {
      if (
        !window.confirm(`\
You are about to delete the post:

    ${post.title}

Are you sure?`)
      ) {
        return;
      }
      this.$apollo
        .mutate({
          mutation: deletePost,
          variables: {
            id: post.id,
          },
          update: (cache, { data: { id } }) => {
            const data = cache.readQuery({
              query: getPosts,
            });
            data.posts.splice(
              data.posts.findIndex((post) => post.id == id),
              1
            );
            cache.writeQuery({
              query: getPosts,
              data,
            });
          },
        })
        .catch((error) => alert(error));
    },
    edit(id, post) {
      this.$apollo
        .mutate({
          mutation: editPost,
          variables: {
            id,
            input: post,
          },
          update: (cache, { data: { post } }) => {
            const data = cache.readQuery({
              query: getPosts,
            });
            data.posts.splice(
              data.posts.findIndex((post) => post.id == id),
              1,
              post
            );
            cache.writeQuery({
              query: getPosts,
              data,
            });
          },
        })
        .then(() => {
          this.authoring = false;
        })
        .catch((error) => alert(error));
    },
    publish(post) {
      this.$apollo
        .mutate({
          mutation: createPost,
          variables: {
            input: {
              author_id: this.$store.getters.userData.author.id,
              ...post,
            },
          },
          update: (cache, { data: { post } }) => {
            const data = cache.readQuery({
              query: getPosts,
            });
            data.posts.unshift(post);
            cache.writeQuery({
              query: getPosts,
              data,
            });
          },
        })
        .then(() => {
          this.authoring = false;
          this.authoring_post = emptyPost();
        })
        .catch((error) => alert(error));
    },
  },
  apollo: {
    posts: {
      query: getPosts,
      update: ({ posts }) => {
        return posts.map((post) => {
          return {
            ...post,
            publish_date: new Date(post.publish_date),
          };
        });
      },
    },
  },
  components: {
    Icon,
    Post,
    PostEditor,
  },
  created() {
    this.$emit("update:layout", PageLayout);
  },
};
</script>

<style lang="scss">
.nothing-to-see {
  margin: 2em 0;
  text-align: center;
  font-size: 1.5em;
  line-height: 1em;
}
</style>
