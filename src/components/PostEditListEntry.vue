<template>
  <li
    :class="expanded ? 'expanded' : 'collapsed'"
    @click="expanded = !expanded"
  >
    <span>{{ edit_date_formatted }}</span>
    <template v-if="expanded">
      <PostEditChanges :edit_id="edit.id" />
    </template>
  </li>
</template>

<script>
import date from "date-and-time";
import PostEditChanges from "./PostEditChanges";

export default {
  data() {
    return {
      expanded: false,
    };
  },
  props: {
    edit: Object,
  },
  computed: {
    edit_date_formatted() {
      return date.format(new Date(this.edit.date), "MMMM D, YYYY - h:mm A");
    },
  },
  components: {
    PostEditChanges,
  },
};
</script>
