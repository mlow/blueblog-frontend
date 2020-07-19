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
      "fetchById",
      "fetchLatest",
    ]),
    postDeleted() {
      this.delete();
      alert("Post deleted!");
    },
  },
  watch: {
    "$route.params.post_id"(post_id) {
      if (!!this.next && this.next.id == post_id) {
        this.incIndex();
      } else if (!!this.previous && this.previous.id == post_id) {
        this.decIndex();
      } else {
        // post not already cached, fetch it
        this.fetchById(post_id);
      }
    },
  },
  created() {
    if (this.$route.params.post_id) {
      this.fetchById(this.$route.params.post_id);
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
