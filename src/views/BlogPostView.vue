<template>
  <div>
    <main>
      <div v-if="current">
        <Post v-bind="{ ...current, date: current.publish_date }">
          <template v-if="ownsPost" v-slot:controls>
            <Icon
              icon="edit"
              :route="{ name: 'blog:edit', params: { id: current.id } }"
            />
            <Icon icon="delete" @click="deletePost" />
          </template>
        </Post>
        <ContentEditList
          v-if="ownsPost && edits && edits.length > 0"
          :edits="edits"
        />
      </div>
      <div v-else class="banner">Check back later!</div>
    </main>
    <nav v-if="current" class="post-navigator">
      <prev-next-navigate v-if="previous" class="prev" :post="previous" />
      <prev-next-navigate v-if="next" class="next" :post="next" />
    </nav>
  </div>
</template>

<script>
import Icon from "../components/Icon.vue";
import Post from "../components/Post.vue";
import PrevNextNavigate from "../components/PrevNextNavigate.vue";
import { mapGetters, mapActions } from "vuex";
import { DeletePost, GetPostEdits } from "../graphql/blog_post.gql";

export default {
  name: "BlogPostView",
  props: {
    id: String,
    slug: String,
  },
  computed: {
    ...mapGetters(["loggedIn", "userData"]),
    ...mapGetters("blog_post", ["current", "previous", "next"]),
    ownsPost() {
      return (
        this.current &&
        this.loggedIn &&
        this.userData.sub == this.current.author_id
      );
    },
  },
  methods: {
    ...mapActions("blog_post", [
      "incIndex",
      "decIndex",
      "delete",
      "fetchByID",
      "fetchLatest",
    ]),
    deletePost() {
      if (
        !window.confirm(`\
You are about to delete the post:

    ${this.current.title}

Are you sure?`)
      ) {
        return;
      }
      this.$apollo
        .mutate({
          mutation: DeletePost,
          variables: {
            id: this.current.id,
          },
        })
        .then(() => this.delete())
        .then(() => {
          if (this.current && this.id) {
            this.$router.push({
              name: "main",
              params: { id: this.current.id, slug: this.current.slug },
            });
          }
          alert("Post deleted!");
        })
        .catch((error) => alert(error));
    },
  },
  watch: {
    id(id) {
      if (!!this.next && this.next.id == id) {
        this.incIndex();
      } else if (!!this.previous && this.previous.id == id) {
        this.decIndex();
      } else if (id) {
        // post not already cached, fetch it
        this.fetchByID({ id });
      } else {
        this.fetchLatest();
      }
    },
    current(post) {
      if (post) {
        document.title = post.title;
        if (this.id && this.slug !== post.slug) {
          window.history.replaceState(null, "", `/${post.id}/${post.slug}`);
        }
      }
    },
  },
  created() {
    if (this.id) {
      this.fetchByID({ id: this.id });
    } else {
      this.fetchLatest();
    }
  },
  apollo: {
    edits: {
      query: GetPostEdits,
      variables() {
        return {
          id: this.current.id,
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
    Post,
    ContentEditList: () =>
      import(
        /* webpackChunkName: "edit-list" */ "../components/ContentEditList.vue"
      ),
    PrevNextNavigate,
  },
};
</script>

<style lang="scss" scoped>
.post-navigator {
  @media (min-width: 768px) {
    margin: -0.75rem;
  }
  overflow: auto;

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
</style>
