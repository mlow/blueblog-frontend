<template>
  <div>
    <ContentForm
      submitLabel="Edit"
      :title.sync="draft.title"
      :content.sync="draft.content"
      :error="error"
      @submit="save"
      @cancel="cancel"
    >
      <template v-slot:before>
        <div class="form-group">
          <DateTimeInput style="width:180px" v-model="draft.publish_date" />
        </div>
      </template>
    </ContentForm>
    <PostDraft v-bind="draft" />
  </div>
</template>

<script>
import PostDraft from "../components/PostDraft";
import DateTimeInput from "../components/DateTimeInput";
import ContentForm from "../components/ContentForm";
import { EditPost } from "../graphql/blog_post.gql";

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
      error: undefined,
    };
  },
  methods: {
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
      });
  },
  components: {
    ContentForm,
    DateTimeInput,
    PostDraft,
  },
};
</script>
