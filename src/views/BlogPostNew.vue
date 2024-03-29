<template>
  <main>
    <h2>New blog post</h2>
    <ContentForm
      submitLabel="Publish"
      :title.sync="draft.title"
      :content.sync="draft.content"
      :error="error"
      :loadFirstDraft="true"
      @submit="submit"
      @cancel="cancel"
    >
      <template v-slot:before>
        <div class="form-group">
          <DateTimeInput style="width:180px" v-model="draft.publish_date" />
        </div>
      </template>
      <template v-slot:controls>
        <FlashIn :display.sync="showDraftSaved">Draft saved</FlashIn>
      </template>
    </ContentForm>
    <BlogDrafts
      ref="drafts"
      :title.sync="draft.title"
      :content.sync="draft.content"
      :selectFirstLoaded="true"
      @draft:saved="showDraftSaved = true"
    />
    <PostPreview v-bind="draft" />
  </main>
</template>

<script>
import ContentForm from "../components/ContentForm.vue";
import BlogDrafts from "../components/BlogDrafts.vue";
import FlashIn from "../components/FlashIn.vue";
import PostPreview from "../components/PostPreview.vue";
import DateTimeInput from "../components/DateTimeInput.vue";

import { CreatePost, GetPostForEdit } from "../graphql/blog_post.gql";

export default {
  data() {
    return {
      draft: {
        title: "",
        content: "",
        publish_date: new Date(),
      },
      error: undefined,
      showDraftSaved: false,
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
          this.$refs.drafts.cancelUpdate();
          this.$refs.drafts.deleteSelected();
        })
        .catch((error) => (this.error = error.message));
    },
    cancel() {
      this.$router.goBackOrMain();
    },
  },
  components: {
    ContentForm,
    BlogDrafts,
    DateTimeInput,
    PostPreview,
    FlashIn,
  },
};
</script>
