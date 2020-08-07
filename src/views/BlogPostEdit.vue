<template>
  <main>
    <h2>Edit blog post</h2>
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
      <template v-slot:controls>
        <FlashIn :display.sync="showDraftSaved">Draft saved</FlashIn>
      </template>
    </ContentForm>
    <BlogDrafts
      ref="drafts"
      :title.sync="draft.title"
      :content.sync="draft.content"
      @draft:saved="showDraftSaved = true"
    />
    <PostPreview v-bind="draft" />
  </main>
</template>

<script>
import PostPreview from "../components/PostPreview";
import BlogDrafts from "../components/BlogDrafts";
import FlashIn from "../components/FlashIn";
import DateTimeInput from "../components/DateTimeInput";
import ContentForm from "../components/ContentForm";

import {
  GetPostForEdit,
  GetPostEdits,
  EditPost,
} from "../graphql/blog_post.gql";

export default {
  name: "BlogPostEdit",
  props: {
    id: String,
  },
  data() {
    return {
      post: {},
      draft: {
        title: null,
        content: null,
        publish_date: null,
      },
      error: undefined,
      showDraftSaved: false,
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
            id: this.id,
            input: this.draft,
          },
          update: (store, { data: { post } }) => {
            const { blog_post: cached } = store.readQuery({
              query: GetPostForEdit,
              variables: { id: post.id },
            });
            Object.keys(cached)
              .filter((key) => key !== "content")
              .forEach((key) => (cached[key] = post[key]));
            store.writeQuery({
              query: GetPostForEdit,
              variables: { id: post.id },
              data: {
                blog_post: {
                  ...cached,
                  content: this.draft.content,
                },
              },
            });
            // Todo: convert this to writeFragment when graphql-tag/loader
            // supports importing fragments
            store.writeQuery({
              query: GetPostEdits,
              variables: { id: post.id },
              data: {
                blog_post: {
                  __typename: "BlogPost",
                  edits: post.edits,
                },
              },
            });
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
          this.$refs.drafts.cancelUpdate();
          this.$refs.drafts.deleteSelected();
        })
        .catch((error) => alert(error));
    },
    cancel() {
      this.$router.goBackOrMain();
    },
  },
  apollo: {
    post: {
      manual: true,
      query: GetPostForEdit,
      variables() {
        return { id: this.id };
      },
      result({
        data: {
          blog_post: { title, slug, content, publish_date },
        },
      }) {
        this.post = {
          title,
          slug,
          content,
          publish_date: new Date(publish_date),
        };
        this.draft = { title, content, publish_date: new Date(publish_date) };
      },
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
