<template>
  <div>
    <form class="form-control">
      <div class="form-group">
        <DateTimeInput style="width:180px" v-model="draft.publish_date" />
      </div>
      <div class="form-group">
        <input
          style="width:100%"
          v-model="draft.title"
          type="text"
          placeholder="Title"
        />
      </div>
      <div class="form-group">
        <textarea
          style="width:100%"
          ref="content"
          @input="resizeTextbox"
          v-model="draft.content"
          placeholder="Write your thoughts..."
        />
      </div>
      <div class="form-group flex flex-between">
        <span>
          <button type="button" @click="save">Edit</button>
          <span v-if="!!error" class="error">{{ error }}</span>
        </span>
        <button type="button" @click="cancel">Cancel</button>
      </div>
    </form>
    <PostDraft v-bind="draft" />
  </div>
</template>

<script>
import PostDraft from "../components/PostDraft";
import DateTimeInput from "../components/DateTimeInput";
import { EditPost } from "../graphql/posts.gql";

export default {
  name: "BlogPostEdit",
  data() {
    return {
      post: {},
      draft: {
        title: null,
        content: null,
        publish_date: null,
      },
      error: "",
    };
  },
  methods: {
    resizeTextbox({ target }) {
      target.style.height = "";
      target.style.height = target.scrollHeight + "px";
    },
    save() {
      if (!this.draft.title.trim()) {
        this.error = "The title cannot be empty.";
        return;
      }
      if (!this.draft.content.trim()) {
        this.error = "The post cannot be empty.";
        return;
      }
      if (
        this.post.title === this.draft.title &&
        this.post.content === this.draft.content &&
        this.post.publish_date.getTime() == this.draft.publish_date.getTime()
      ) {
        this.error = "No changes to save.";
        return;
      }

      this.$apollo
        .mutate({
          mutation: EditPost,
          variables: {
            id: this.post.id,
            input: this.draft,
          },
        })
        .then(({ data: { post } }) => {
          const cached = this.$store.getters["blog_post/byID"](post.id);
          if (cached) {
            Object.assign(cached, {
              ...post,
              publish_date: new Date(post.publish_date),
            });
          }
          this.$router.push({
            name: "main",
            params: { id: post.id, slug: post.slug },
          });
        })
        .catch((error) => alert(error));
    },
    cancel() {
      this.$router.push({
        name: "main",
        params: { id: this.post.id, slug: this.post.slug },
      });
    },
  },
  mounted() {
    this.$store
      .dispatch("blog_post/fetchByID", {
        id: this.$route.params.id,
      })
      .then((post) => {
        this.post = post;
        Object.keys(this.draft).forEach((key) => {
          this.draft[key] = post[key];
        });
        setTimeout(() => this.resizeTextbox({ target: this.$refs.content }));
      });
  },
  components: {
    PostDraft,
    DateTimeInput,
  },
};
</script>
