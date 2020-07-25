<template>
  <VueMarkdown class="rendered-markdown" :source="source" />
</template>

<script>
import VueMarkdown from "vue-markdown";
export default {
  props: {
    source: String,
  },
  components: {
    VueMarkdown,
  },
};
</script>
