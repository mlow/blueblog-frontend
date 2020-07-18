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
import { GetPost, GetPosts } from "../graphql/posts.gql";

function fixDate(obj, prop) {
  obj[prop] = new Date(obj[prop]);
  return obj;
}

export default {
  name: "BlogPostView",
  data() {
    return {
      posts: [],
      index: 0,
      forcedRecompute: 0,
    };
  },
  computed: {
    current: {
      get() {
        this.forcedRecompute;
        const post = this.posts[this.index];
        if (post) {
          window.document.title = post.title;
        }
        return post;
      },
      set(value) {
        this.posts[this.index] = value;
        this.recompute();
      },
    },
    previous: {
      get() {
        this.forcedRecompute;
        return this.posts[this.index - 1];
      },
      set(value) {
        if (this.index == 0) {
          // If we're at the beginning, prepend entry to list and bump index
          this.posts.unshift(value);
          this.index++;
        } else {
          this.posts[this.index - 1] = value;
          this.recompute();
        }
      },
    },
    next: {
      get() {
        this.forcedRecompute;
        return this.posts[this.index + 1];
      },
      set(value) {
        this.posts[this.index + 1] = value;
        this.recompute();
      },
    },
  },
  methods: {
    getLatestPost() {
      this.$apollo
        .query({
          query: GetPosts,
          variables: {
            before: 0,
            after: 2,
          },
          fetchPolicy: "no-cache",
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
              this.current = fixDate(firstPost.node, "publish_date");
            }
            if (nextPost !== undefined) {
              this.next = fixDate(nextPost.node, "publish_date");
            }
          }
        )
        .catch((error) => {
          alert(`Error fetching post: ${error.message}`);
        });
    },
    getPost(id) {
      return this.$apollo
        .query({
          query: GetPost,
          variables: { id },
        })
        .then(({ data: { blog_post: post } }) => {
          this.current = fixDate(post, "publish_date");
          window.history.replaceState(null, "", `/${post.id}/${post.slug}`);
        })
        .then(() => this.updateAdjacentPosts())
        .catch((error) => {
          alert(`Error fetching post: ${error.message}`);
        });
    },
    updateAdjacentPosts() {
      const before = !this.previous;
      const after = !this.next;
      if (!(before || after)) {
        return;
      }
      this.$apollo
        .query({
          query: GetPosts,
          variables: {
            cursor: this.current.cursor,
            before: before ? 1 : 0,
            after: after ? 1 : 0,
          },
          fetchPolicy: "no-cache",
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
              this.previous = fixDate(previous.node, "publish_date");
            } else if (before) {
              // if requested before but there was none, set previous to null
              this.previous = null;
            }
            if (next !== undefined) {
              this.next = fixDate(next.node, "publish_date");
            } else if (after) {
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
      // delete the current post
      this.posts.splice(this.index, 1);
      if (this.index > 0) {
        // move to the previous post if there is one
        this.index--;
      }
      alert("Post deleted!");
    },
    recompute() {
      this.forcedRecompute++;
    },
  },
  watch: {
    index() {
      this.updateAdjacentPosts();
    },
    "$route.params.post_id"(post_id) {
      if (!!this.next && this.next.id == post_id) {
        this.index++;
      } else if (!!this.previous && this.previous.id == post_id) {
        this.index--;
      } else {
        // post not already cached, fetch it
        this.getPost(post_id);
      }
    },
  },
  created() {
    if (this.$route.params.post_id) {
      this.getPost(this.$route.params.post_id);
    } else {
      this.getLatestPost();
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
