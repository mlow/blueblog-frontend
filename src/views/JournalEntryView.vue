<template>
  <main style="margin-bottom: 2rem;">
    <Post
      v-if="decrypted !== undefined"
      v-bind="decrypted"
      :date="entry.date"
      :render="true"
    >
      <template v-slot:controls>
        <Icon icon="edit" :route="{ name: 'journal:edit', params: { id } }" />
        <Icon icon="delete" @click="deleteEntry" />
      </template>
    </Post>
    <div v-else-if="!!error" class="banner">An error occured: {{ error }}</div>
    <div v-else class="banner">Journal entry not found.</div>
  </main>
</template>

<script>
import {
  getJournalEntries,
  getJournalEntry,
  deleteJournalEntry,
} from "../graphql/journal.gql";
import { decrypt } from "../encryption";
import Post from "../components/Post.vue";
import Icon from "../components/Icon.vue";

export default {
  name: "JournalEntryView",
  props: {
    id: String,
  },
  data() {
    return {
      decrypted: undefined,
      error: undefined,
    };
  },
  watch: {
    entry(value) {
      if (value) {
        decrypt(value, this.$store.getters.masterKey)
          .then((decrypted) => (this.decrypted = JSON.parse(decrypted)))
          .catch((error) => {
            this.decrypted = undefined;
            this.error = error.message;
          });
      }
    },
  },
  methods: {
    deleteEntry() {
      if (
        !window.confirm(`\
You are about to delete your journal entry:

    ${this.decrypted.title}

Are you sure?`)
      ) {
        return;
      }
      this.$apollo
        .mutate({
          mutation: deleteJournalEntry,
          variables: {
            id: this.id,
          },
          update: (store, { data: { id } }) => {
            const data = store.readQuery({ query: getJournalEntries });
            data.journal_entries.edges = data.journal_entries.edges.filter(
              ({ node }) => node.id !== id
            );
            store.writeQuery({ query: getJournalEntries, data });
          },
        })
        .then(() => {
          this.$router.push({ name: "journal:view" });
          alert("Entry deleted!");
        })
        .catch((error) => alert(error));
    },
  },
  apollo: {
    entry: {
      query: getJournalEntry,
      variables() {
        return { id: this.id };
      },
      update: ({ journal_entry: entry }) => entry,
    },
  },
  components: {
    Post,
    Icon,
  },
};
</script>
