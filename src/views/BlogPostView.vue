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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "BlogPostView",
  computed: {
    ...mapGetters("blog_post", ["current", "previous", "next"]),
  },
  methods: {
    ...mapActions("blog_post", [
      "incIndex",
      "decIndex",
      "delete",
      "fetchByID",
      "fetchLatest",
    ]),
    async postDeleted() {
      await this.delete();
      if (this.current && this.$route.params.id) {
        this.$router.push({
          name: "main",
          params: { id: this.current.id, slug: this.current.slug },
        });
      }
      alert("Post deleted!");
    },
  },
  watch: {
    "$route.params.id"(post_id) {
      if (!!this.next && this.next.id == post_id) {
        this.incIndex();
      } else if (!!this.previous && this.previous.id == post_id) {
        this.decIndex();
      } else if (post_id) {
        // post not already cached, fetch it
        this.fetchByID({ id: post_id });
      }
    },
    current(post) {
      if (post) {
        document.title = post.title;
        if (this.$route.params.id && this.$route.params.slug !== post.slug) {
          window.history.replaceState(null, "", `/${post.id}/${post.slug}`);
        }
      }
    },
  },
  created() {
    if (this.$route.params.id) {
      this.fetchByID({ id: this.$route.params.id });
    } else {
      this.fetchLatest();
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
