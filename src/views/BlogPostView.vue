<template>
  <div>
    <Post v-if="!!current" :post="current" @deleted="postDeleted" />
    <div v-else class="nothing-to-see">Check back later!</div>
    <div class="post-navigator">
      <prev-next-navigate v-if="!!previous" class="prev" :post="previous" />
      <prev-next-navigate v-if="!!next" class="next" :post="next" />
    </div>
  </div>
</template>

<script>
import Post from "../components/Post.vue";
import PrevNextNavigate from "../components/PrevNextNavigate.vue";
import { GetPost, GetPosts, GetAdjacentPosts } from "../graphql/posts.gql";

export default {
  name: "BlogPostView",
  data() {
    return {
      current: null,
      previous: null,
      next: null,
    };
  },
  methods: {
    getLatestPost() {
      this.$apollo
        .query({
          query: GetPosts,
        })
        .then(
          ({
            data: {
              blog_posts: {
                afterEdges: [firstPost, nextPost],
              },
            },
          }) => {
            if (firstPost !== undefined) {
              this.current = firstPost.node;
              this.current.publish_date = new Date(firstPost.node.publish_date);
            }
            if (nextPost !== undefined) {
              this.next = nextPost.node;
              this.next.publish_date = new Date(nextPost.node.publish_date);
            }
          }
        )
        .catch((error) => {
          alert(`Error fetching post: ${error.message}`);
        });
    },
    getRoutedPost() {
      return this.$apollo
        .query({
          query: GetPost,
          variables: { id: this.$route.params.post_id },
        })
        .then(({ data: { blog_post: post } }) => {
          this.current = post;
          this.current.publish_date = new Date(post.publish_date);
          window.history.replaceState(null, "", `/${post.id}/${post.slug}`);
        })
        .catch((error) => {
          alert(`Error fetching post: ${error.message}`);
        });
    },
    getAdjacentPosts() {
      this.$apollo
        .query({
          query: GetAdjacentPosts,
          variables: {
            cursor: this.current.cursor,
          },
        })
        .then(
          ({
            data: {
              blog_posts: {
                beforeEdges: [previous],
                afterEdges: [next],
              },
            },
          }) => {
            if (previous !== undefined) {
              this.previous = previous.node;
              this.previous.publish_date = new Date(previous.node.publish_date);
            } else {
              // if requested before but there was none, set previous to null
              this.previous = null;
            }
            if (next !== undefined) {
              this.next = next.node;
              this.next.publish_date = new Date(next.node.publish_date);
            } else {
              // if requested after but there was none, set next to null
              this.next = null;
            }
          }
        )
        .catch((error) => {
          console.log(error);
        });
    },
    postDeleted() {
      alert("Post deleted!");
      this.current = null;
      if (this.next !== null) {
        this.current = this.next;
        this.getAdjacentPosts();
      } else if (this.previous !== null) {
        this.current = this.previous;
        this.getAdjacentPosts();
      }
    },
  },
  watch: {
    "$route.params.post_id"(post_id) {
      if (!!this.next && this.next.id == post_id) {
        this.current = this.next;
        this.getAdjacentPosts();
      } else if (!!this.previous && this.previous.id == post_id) {
        this.current = this.previous;
        this.getAdjacentPosts();
      } else {
        // post not already cached, fetch it
        this.getRoutedPost().then(() => this.getAdjacentPosts());
      }
      console.log(this.$apollo);
    },
  },
  mounted() {
    if (!this.$route.params.post_id) {
      this.getLatestPost();
    } else {
      this.getRoutedPost().then(() => this.getAdjacentPosts());
    }
  },
  components: {
    Post,
    PrevNextNavigate,
  },
};
</script>

<style lang="scss" scoped>
.post-navigator {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 1.5rem;

  &:after {
    content: "";
    display: block;
    clear: both;
  }

  > .prev {
    float: left;
    text-align: left;
  }
  > .next {
    float: right;
    text-align: right;
  }
}

.nothing-to-see {
  margin: 2em 0;
  text-align: center;
  font-size: 1.5em;
  line-height: 1em;
}
</style>
