<template>
  <main>
    <h2>Edit journal entry</h2>
    <ContentForm
      submitLabel="Edit"
      :title.sync="draft.title"
      :content.sync="draft.content"
      :error="error"
      :handleDrafts="false"
      :loadFirstDraft="true"
      @submit="submit"
      @cancel="cancel"
    >
      <template v-slot:before>
        <div class="form-group">
          <DateInput style="width:160px" v-model="draft.date" />
        </div>
      </template>
      <template v-slot:controls>
        <FlashIn :display.sync="showDraftSaved">Draft saved</FlashIn>
      </template>
    </ContentForm>
    <JournalDrafts
      ref="drafts"
      :title.sync="draft.title"
      :content.sync="draft.content"
      @draft:saved="showDraftSaved = true"
    />
    <PostPreview v-bind="draft" :publish_date="draft.date" />
  </main>
</template>

<script>
import JouralEntryMixin from "../mixins/JournalEntryMixin";

import { updateJournalEntry, getJournalEntry } from "../graphql/journal.gql";
import ContentForm from "../components/ContentForm.vue";
import PostPreview from "../components/PostPreview.vue";
import DateInput from "../components/DateInput.vue";
import JournalDrafts from "../components/JournalDrafts.vue";
import FlashIn from "../components/FlashIn.vue";

export default {
  name: "JournalEntryEdit",
  mixins: [JouralEntryMixin],
  data() {
    return {
      showDraftSaved: false,
    };
  },
  watch: {
    entry(value) {
      if (value) {
        this.draft.date = new Date(value.date);
      }
    },
    decrypted(value) {
      this.draft = Object.assign({}, this.draft, value);
    },
  },
  methods: {
    async submit() {
      if (!this.validate()) {
        return;
      }

      this.$apollo
        .mutate({
          mutation: updateJournalEntry,
          variables: {
            id: this.id,
            input: {
              ...(await this.encrypted()),
              date: this.draft.date,
            },
          },
          update: (store, { data }) => {
            store.writeQuery({
              query: getJournalEntry,
              variables: { id: this.entry_id },
              data,
            });
          },
        })
        .then(
          ({
            data: {
              journal_entry: { id },
            },
          }) => {
            this.$router.push({
              name: "journal:entry",
              params: { id },
            });
            this.$refs.drafts.cancelUpdate();
            this.$refs.drafts.deleteSelected();
          }
        )
        .catch((error) => (this.error = error.message));
    },
    cancel() {
      this.$router.goBackOrMain();
    },
  },
  components: {
    ContentForm,
    PostPreview,
    DateInput,
    JournalDrafts,
    FlashIn,
  },
};
</script>
