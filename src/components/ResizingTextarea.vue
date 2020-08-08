<template>
  <textarea
    ref="field"
    :value="value"
    @input="
      $emit('input', $event.target.value);
      fitTextareaToContent($event.target);
    "
  />
</template>

<script>
export default {
  props: ["value"],
  data() {
    return { lastScrollHeight: 0 };
  },
  watch: {
    value: {
      handler() {
        setTimeout(() => this.fitTextareaToContent(this.$refs.field));
      },
      immediate: true,
    },
  },
  methods: {
    fitTextareaToContent(target) {
      const scrollHeight = target.scrollHeight;
      if (scrollHeight === this.lastScrollHeight) {
        return;
      }

      const [scrollX, scrollY] = [window.scrollX, window.scrollY];

      // Resize textarea to size of its contents
      target.style.height = "";
      target.style.height =
        (this.lastScrollHeight = target.scrollHeight) + "px";

      // restore window scroll position
      window.scrollTo(scrollX, scrollY);
    },
  },
};
</script>
