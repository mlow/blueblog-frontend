<template>
  <div id="view:main">
    <span id="user-controls">
      <FaIcon
        v-if="this.$store.getters.loggedIn"
        v-show="!authoring"
        class="icon control"
        icon="feather-alt"
        size="lg"
        @click="authoring = true"
      />
      <span class="control">
        <router-link v-if="this.$store.getters.loggedIn" to="/logout">Logout</router-link>
        <router-link v-else to="/login">Login</router-link>
      </span>
    </span>
    <PostEditor
      v-if="authoring"
      v-bind="authoring_post"
      @cancel="authoring=false"
      nothing
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
import gql from "graphql-tag";

import PageLayout from "../layouts/PageLayout.vue";
import Post from "../components/Post.vue";
import PostEditor from "../components/PostEditor";

export default {
  name: "Main",
  data() {
    return {
      authoring: false,
      authoring_post: {
        id: null,
        title: "",
        content: "",
        publish_date: new Date()
      },
      posts: []
    };
  },
  methods: {
    postEdit(post) {
      for (let k in this.authoring_post) {
        this.authoring_post[k] = post[k];
      }
      this.authoring = true;
    },
    postDelete(post) {
      const confirm = window.confirm(
        `\
You are about to delete the post:

    ${post.title}

Are you sure?`
      );
      if (!confirm) {
        return;
      }
    },
    publish() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation createPost($input: CreatePostInput!) {
              post: createPost(input: $input) {
                id
                title
                content
                publish_date
              }
            }
          `,
          variables: {
            input: {
              author_id: this.$store.getters.userData.author.id,
              ...this.authored_post
            }
          }
        })
        .then(data => {
          this.authoring = false;
          this.authoring_post = {
            title: "",
            content: ""
          };
          this.posts.unshift({
            ...data.data.post,
            publish_date: new Date(data.data.post.publish_date)
          });
        })
        .catch(error => {
          if (Object.prototype.hasOwnProperty.call(error, "graphQLErrors")) {
            this.error = error.graphQLErrors[0].message;
          } else {
            this.error = error.message;
          }
        });
    }
  },
  apollo: {
    posts: {
      query: gql`
        query getPosts {
          posts {
            id
            title
            content
            publish_date
            author {
              id
            }
            edits {
              id
              date
            }
          }
        }
      `,
      update: data => {
        return data.posts.map(post => {
          return {
            ...post,
            publish_date: new Date(post.publish_date)
          };
        });
      }
    }
  },
  components: {
    Post,
    PostEditor
  },
  created() {
    this.$emit("update:layout", PageLayout);
  }
};
</script>

<style lang="scss" scoped>
.nothing-to-see {
  margin: 2em 0;
  text-align: center;
  font-size: 1.5em;
  line-height: 1em;
}
</style>
