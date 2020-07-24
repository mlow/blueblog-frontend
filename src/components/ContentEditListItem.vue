<template>
  <collapsible :label="edit_date_formatted">
    <ContentEditChanges :edit_id="edit.id" />
  </collapsible>
</template>

<script>
import date from "date-and-time";
import ContentEditChanges from "./ContentEditChanges.vue";
import Collapsible from "./Collapsible.vue";

export default {
  props: {
    edit: Object,
  },
  computed: {
    edit_date_formatted() {
      return date.format(new Date(this.edit.date), "MMMM D, YYYY - h:mm A");
    },
  },
  components: {
    Collapsible,
    ContentEditChanges,
  },
};
</script>
