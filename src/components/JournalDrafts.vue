<template>
  <DraftList
    :drafts="drafts"
    @draft:select="select"
    @draft:delete="confirmDelete"
    @draft:new="newDraft"
  />
</template>

<script>
import { formatDate } from "@/util";
import { encrypt, decrypt } from "@/encryption";
import {
  getDrafts,
  createJournalEntry as createDraft,
  updateJournalEntry as updateDraft,
  deleteJournalEntry as deleteDraft,
} from "../graphql/journal.gql";
import DraftMixin from "../mixins/DraftMixin";
import DraftList from "./DraftList";

export default {
  mixins: [DraftMixin],
  props: {
    selectFirstLoaded: Boolean,
  },
  data() {
    return {
      drafts: [],
    };
  },
  watch: {
    encryptedDrafts(drafts) {
      Promise.all(drafts.map(({ draft }) => this.decrypted(draft))).then(
        (results) => {
          this.drafts = results.sort(
            (a, b) => b.date.getTime() - a.date.getTime()
          );
        }
      );
    },
    drafts(drafts) {
      if (drafts.length > 0 && this.selectFirstLoaded && !this.selected.id) {
        this.select(drafts[0]);
      }
    },
  },
  methods: {
    decrypted(draft) {
      return decrypt(draft, this.$store.getters.masterKey)
        .then((decrypted) => JSON.parse(decrypted))
        .then(({ title, content }) => {
          const date = new Date(draft.date);
          const formatted = formatDate(date, "YYYY-MM-DD HH:mm");
          return {
            id: draft.id,
            date,
            title,
            content,
            label: formatted + (title ? " | " + title : ""),
          };
        });
    },
    encrypted() {
      return encrypt(
        JSON.stringify({
          title: this.title,
          content: this.content,
        }),
        this.$store.getters.masterKey
      );
    },
    async save() {
      return this.$apollo
        .mutate({
          mutation: createDraft,
          variables: {
            input: {
              ...(await this.encrypted()),
              draft: true,
            },
          },
          update(store, { data: { journal_entry: draft } }) {
            addDraftToStore(store, draft);
          },
        })
        .then(({ data: { journal_entry: draft } }) => {
          this.selected.id = draft.id;
        });
    },
    async update() {
      return this.$apollo.mutate({
        mutation: updateDraft,
        variables: {
          id: this.selected.id,
          input: {
            ...(await this.encrypted()),
            date: new Date(),
          },
        },
        update(store, { data: { journal_entry: draft } }) {
          addDraftToStore(store, draft);
        },
      });
    },
    delete(draft) {
      return this.$apollo
        .mutate({
          mutation: deleteDraft,
          variables: { id: draft.id },
          update(store, { data: { id } }) {
            const data = store.readQuery({ query: getDrafts });
            data.drafts.edges = data.drafts.edges.filter(
              ({ draft: existing }) => existing.id !== id
            );
            store.writeQuery({ query: getDrafts, data });
          },
        })
        .then(({ data: { id } }) => {
          if (this.selected.id === id) {
            this.newDraft();
          }
        });
    },
  },
  apollo: {
    encryptedDrafts: {
      query: getDrafts,
      update: ({ drafts: { edges } }) => edges,
    },
  },
  components: {
    DraftList,
  },
};

function addDraftToStore(store, draft) {
  const data = store.readQuery({ query: getDrafts });
  const existingDraft = data.drafts.edges.find(
    ({ draft: existing }) => existing.id === draft.id
  );
  if (existingDraft) {
    Object.assign(existingDraft.draft, draft);
  } else {
    data.drafts.edges.unshift({
      __typename: "JournalEntryEdge",
      draft,
    });
  }
  store.writeQuery({ query: getDrafts, data });
}
</script>
