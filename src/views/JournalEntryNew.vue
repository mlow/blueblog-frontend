<template>
  <main>
    <h2>New journal entry</h2>
    <ContentForm
      submitLabel="Save"
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
        <FlashIn style="margin-left: 0.5rem" :display.sync="showDraftSaved">
          Draft saved
        </FlashIn>
      </template>
    </ContentForm>
    <JournalDrafts
      ref="drafts"
      :title.sync="draft.title"
      :content.sync="draft.content"
      :selectFirstLoaded="true"
      @draft:saved="showDraftSaved = true"
    />
    <PostPreview v-bind="draft" :publish_date="draft.date" />
  </main>
</template>

<script>
import JournalEntryMixin from "../mixins/JournalEntryMixin";

import {
  createJournalEntry,
  getJournalEntry,
  getJournalEntries,
} from "../graphql/journal.gql";
import ContentForm from "../components/ContentForm.vue";
import PostPreview from "../components/PostPreview.vue";
import DateInput from "../components/DateInput.vue";
import JournalDrafts from "../components/JournalDrafts.vue";
import FlashIn from "../components/FlashIn.vue";

export default {
  name: "JournalEntryNew",
  mixins: [JournalEntryMixin],
  data() {
    return {
      showDraftSaved: false,
    };
  },
  methods: {
    async submit() {
      if (!this.validate()) {
        return;
      }

      this.$apollo
        .mutate({
          mutation: createJournalEntry,
          variables: {
            input: {
              ...(await this.encrypted()),
              date: this.draft.date,
            },
          },
          update: (store, { data }) => {
            store.writeQuery({
              query: getJournalEntry,
              variables: { id: data.journal_entry.id },
              data,
            });
            // append new entry to existing entries
            const existing = store.readQuery({
              query: getJournalEntries,
            });
            existing.journal_entries.edges.push({
              __typename: "JournalEntryEdge",
              node: data.journal_entry,
            });
            existing.journal_entries.edges.sort((a, b) =>
                new Date(b.node.date).getTime() -
                new Date(a.node.date).getTime()
            );
            store.writeQuery({ query: getJournalEntries, data: existing });
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
