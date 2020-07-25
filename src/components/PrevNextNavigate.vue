<template>
  <div>
    <router-link
      :to="{ name: 'main', params: this.link_params }"
    >{{ this.post.title }}</router-link>
    <p class="date">{{ this.publish_date_formatted }}</p>
  </div>
</template>

<script>
import { formatDate } from "@/util";

export default {
  props: {
    post: Object,
  },
  computed: {
    link_params() {
      return {
        id: this.post.id,
        slug: this.post.slug,
      };
    },
    publish_date_formatted() {
      return formatDate(this.post.publish_date, "MMMM D, YYYY");
    },
  },
};
</script>

<style lang="scss" scoped>
.date {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>
