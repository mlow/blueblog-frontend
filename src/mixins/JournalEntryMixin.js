import { encrypt, decrypt } from "../encryption";
import { getJournalEntry } from "../graphql/journal.gql";

export default {
  props: {
    id: String,
  },
  data() {
    return {
      draft: {
        title: "",
        content: "",
        date: new Date(),
      },
      decrypted: undefined,
      error: undefined,
    };
  },
  watch: {
    entry(value) {
      if (value) {
        decrypt(value, this.$store.getters.masterKey)
          .then((decrypted) => {
            this.decrypted = JSON.parse(decrypted);
          })
          .catch((error) => {
            this.decrypted = undefined;
            this.error = error.message;
          });
      }
    },
  },
  methods: {
    validate() {
      if (!this.draft.date) {
        this.error = "Did you forget to set the date?";
        return false;
      }
      if (!this.draft.content.trim()) {
        this.error = "Forgetting to write something?";
        return false;
      }
      return true;
    },
    encrypted() {
      return encrypt(
        JSON.stringify({
          title: this.draft.title,
          content: this.draft.content,
        }),
        this.$store.getters.masterKey
      );
    },
  },
  apollo: {
    entry: {
      query: getJournalEntry,
      skip() {
        return !this.id;
      },
      variables() {
        return { id: this.id };
      },
      update: ({ journal_entry: entry }) => entry,
    },
  },
};
