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
    <form v-if="authoring" id="new_post">
      <div>
        <input v-model="authoring_post.title" type="text" placeholder="Title" />
      </div>
      <div>
        <textarea
          oninput="this.style.height = '';this.style.height = this.scrollHeight + 'px'"
          v-model="authoring_post.content"
          placeholder="Write your thoughts..."
        />
      </div>
      <div class="form-controls">
        <span>
          <button type="button" @click="publish()">Publish</button>
          <input type="checkbox" id="publish_later" />
          <label for="publish_later">Publish later</label>
          <span v-if="!!error" v-html="error" class="error" />
        </span>
        <button type="button" @click="authoring = false">Cancel</button>
      </div>
    </form>
    <section id="posts">
      <template v-if="authoring">
        <Post :editing="true" :post="authored_post" />
      </template>
      <template v-else-if="posts.length">
        <Post v-for="post in posts" :key="post.id" :post="post" />
      </template>
      <div v-else class="nothing">Check back later!</div>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

import PageLayout from "../layouts/PageLayout.vue";
import Post from "../components/Post.vue";

export default {
  name: "Main",
  data() {
    return {
      authoring: false,
      authoring_post: {
        title: "",
        content: ""
      },
      posts: [],
      error: ""
    };
  },
  computed: {
    authored_post() {
      return {
        title: this.authoring_post.title || "Title",
        content: this.authoring_post.content || "Write your thoughts...",
        publish_date: new Date()
      };
    }
  },
  methods: {
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
    Post
  },
  created() {
    this.$emit("update:layout", PageLayout);
  }
};
</script>
