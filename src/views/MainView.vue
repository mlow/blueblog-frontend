<template>
  <div id="view:main">
    <FaIcon
      v-show="!authoring"
      class="feather"
      icon="feather-alt"
      size="lg"
      @click="authoring = true"
    />
    <div id="new_post">
      <form v-show="authoring">
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
          </span>
          <button type="button" @click="authoring = false">Cancel</button>
        </div>
      </form>
    </div>
    <section id="posts">
      <Post v-if="authoring" v-bind="authored_post" />
      <Post v-for="post in posts" :key="post.id" v-bind="post" />
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
      posts: []
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
              author_id: "2ca9b35f-58ef-407d-aaeb-7afc24f9b447",
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
