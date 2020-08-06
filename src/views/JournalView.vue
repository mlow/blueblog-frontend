<template>
  <main style="margin-bottom: 2rem;">
    <div v-if="encryptionConfigured">
      <div v-if="sortedYears.length > 0">
        <h1 style="margin: 0.25rem 0;">Journal</h1>
        <Collapsible
          v-for="(year, iy) in sortedYears"
          :key="year"
          :initiallyExpanded="iy === 0"
          :label="year"
          :labelStyle="{
            'font-size': '1.5rem',
          }"
        >
          <Collapsible
            v-for="(month, im) in sortedKeys(entriesByYearAndMonth[year])"
            :key="`${year}-${month}`"
            :label="getMonth(entriesByYearAndMonth[year][month][0].date)"
            :initiallyExpanded="iy === 0 && im === 0"
            :labelStyle="{
              'font-size': '1.25rem',
            }"
          >
            <router-link
              v-for="entry in entriesByYearAndMonth[year][month]"
              :key="entry.id"
              :to="{ name: 'journal:entry', params: { id: entry.id } }"
            >
              {{ getDate(entry.date) }}
              <br />
            </router-link>
          </Collapsible>
        </Collapsible>
      </div>
      <div v-else class="banner">
        No journal entries, yet!
        <router-link :to="{ name: 'journal:new' }">Click here</router-link>
        to start your journal.
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
import Collapsible from "../components/Collapsible.vue";

const longDateFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const monthFormatter = Intl.DateTimeFormat(undefined, { month: "long" });

export default {
  data() {
    return {
      entries: [],
    };
  },
  computed: {
    entriesByYearAndMonth() {
      const result = {};
      this.entries.forEach((entry) => {
        const year = entry.date.getFullYear();
        const month = entry.date.getMonth() + 1;
        const years = result[year] || (result[year] = {});
        const entriesByMonth = years[month] || (years[month] = []);
        entriesByMonth.push(entry);
      });
      return result;
    },
    sortedYears() {
      return this.sortedKeys(this.entriesByYearAndMonth);
    },
    encryptionConfigured() {
      return !!this.$store.getters.userData.author.wrapped_key;
    },
  },
  methods: {
    sortedKeys: (obj) => Object.keys(obj).sort((a, b) => b - a),
    getMonth: (date) => monthFormatter.format(date),
    getDate: (date) => longDateFormatter.format(date),
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
  components: {
    Collapsible,
  },
};
</script>
