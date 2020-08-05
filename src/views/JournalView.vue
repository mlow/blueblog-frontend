<template>
  <main>
    <div v-if="encryptionConfigured">
      <div v-for="(entriesByMonth, year) in edgesByYearAndMonth" :key="year">
        <h1>{{ year }}</h1>
        <div v-for="(entries, month) in entriesByMonth" :key="month">
          <h2>{{ formatDate(parse(month, "M"), "MMMM") }}</h2>
          <ol>
            <li v-for="entry in entries" :key="entry.id">
              <router-link
                :to="{ name: 'journal:entry', params: { id: entry.id } }"
              >
                {{ formatDate(entry.date, "MMMM D") }}
              </router-link>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div v-else class="banner">
      Head to
      <router-link to="/profile">your profile</router-link>
      and update your password in order to use the journal.
    </div>
  </main>
</template>

<script>
import { getJournalEntries } from "../graphql/journal.gql";
import { formatDate } from "@/util";
import { parse } from "date-and-time";

export default {
  data() {
    return {
      entries: [],
    };
  },
  computed: {
    edgesByYearAndMonth() {
      const result = {};
      this.entries.forEach((entry) => {
        const year = entry.date.getFullYear();
        const month = entry.date.getMonth() + 1;
        let years = result[year] || (result[year] = {});
        if (years === undefined) {
          years = result[year] = {};
        }
        let entriesByMonth = years[month];
        if (entriesByMonth === undefined) {
          entriesByMonth = years[month] = [];
        }
        entriesByMonth.push(entry);
      });
      return result;
    },
    encryptionConfigured() {
      return !!this.$store.getters.userData.author.wrapped_key;
    },
  },
  methods: {
    formatDate,
    parse,
  },
  apollo: {
    entries: {
      query: getJournalEntries,
      skip() {
        return !this.encryptionConfigured;
      },
      update({ journal_entries: { edges } }) {
        return edges.map(({ node }) => ({
          ...node,
          date: new Date(node.date),
        }));
      },
    },
  },
};
</script>
