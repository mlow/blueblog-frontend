<template>
  <div id="app">
    <div id="container">
      <div id="content">
        <header id="header">
          <span class="blog_title">Blue Blog</span>
        </header>
        <div id="new_post">
          <FaIcon
            v-show="!writing"
            class="feather"
            icon="feather-alt"
            size="lg"
            @click="writing = true"
          />

          <form v-show="writing">
            <div>
              <input v-model="post.title" type="text" placeholder="Title" />
            </div>
            <div>
              <textarea
                oninput="this.style.height = '';this.style.height = this.scrollHeight + 'px'"
                v-model="post.content"
                placeholder="Write your thoughts..."
              />
            </div>
            <div class="form-controls">
              <span>
                <button type="button">Publish</button>
                <input type="checkbox" id="publish_later" />
                <label for="publish_later">Publish later</label>
              </span>
              <button type="button" @click="writing = false">Cancel</button>
            </div>
          </form>
        </div>
        <section id="posts">
          <Post
            v-if="writing"
            :title="post.title || 'Title'"
            :content="post.content || 'Write your thoughts...'"
            :publish_date="new Date()"
          />
          <Post
            v-for="post in posts"
            :key="post.id"
            :title="post.title"
            :content="post.content"
            :publish_date="new Date(post.publish_date)"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "./components/Post.vue";
import gql from "graphql-tag";

export default {
  name: "App",
  data: () => {
    return {
      writing: false,
      post: {
        title: "",
        content: ""
      },
      posts: []
    };
  },
  components: {
    Post
  },
  apollo: {
    posts: gql`
      query getPosts {
        posts {
          id
          title
          content
          publish_date
        }
      }
    `
  }
};
</script>

<style lang="scss">
@import "./assets/style.scss";
</style>
