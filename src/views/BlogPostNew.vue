<template>
  <div>
    <ContentForm
      submitLabel="Publish"
      :title.sync="draft.title"
      :content.sync="draft.content"
      :error="error"
      @submit="submit"
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
import ContentForm from "../components/ContentForm.vue";
import PostDraft from "../components/PostDraft.vue";
import DateTimeInput from "../components/DateTimeInput.vue";

import { CreatePost, GetPostForEdit } from "../graphql/blog_post.gql";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      draft: {
        title: "",
        content: "",
        publish_date: new Date(),
      },
      error: undefined,
    };
  },
  methods: {
    submit() {
      if (!this.draft.title.trim()) {
        this.error = "The title cannot be empty.";
        return;
      }
      if (!this.draft.content.trim()) {
        this.error = "The post cannot be empty.";
        return;
      }

      this.$apollo
        .mutate({
          mutation: CreatePost,
          variables: {
            input: { ...this.draft },
          },
          update: (store, { data: { post } }) => {
            store.writeQuery({
              query: GetPostForEdit,
              variables: { id: post.id },
              data: {
                blog_post: {
                  title: post.title,
                  content: this.draft.content,
                  publish_date: post.publish_date,
                  slug: post.slug,
                  __typename: "BlogPost",
                },
              },
            });
          },
        })
        .then(async ({ data: { post } }) => {
          await this.$store.dispatch("blog_post/flushWithNewPost", {
            ...post,
            publish_date: new Date(post.publish_date),
          });
          this.$router.push({
            name: "main",
            params: { id: post.id, slug: post.slug },
          });
        })
        .catch((error) => (this.error = error.message));
    },
    cancel() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: "main" });
      }
    },
    ...mapActions("ui", ["setAuthoring"]),
  },
  mounted() {
    this.setAuthoring(true);
  },
  beforeRouteLeave(to, from, next) {
    this.setAuthoring(false);
    next();
  },
  components: {
    ContentForm,
    PostDraft,
    DateTimeInput,
  },
};
</script>
