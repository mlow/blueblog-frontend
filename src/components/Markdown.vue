<template>
  <VueMarkdown class="rendered-markdown" :source="source" :breaks="false" />
</template>

<script>
export default {
  props: {
    source: String,
  },
  components: {
    VueMarkdown: () =>
      import(/* webpackChunkName: "markdown" */ "vue-markdown"),
  },
};
</script>
