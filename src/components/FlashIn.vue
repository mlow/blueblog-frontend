<template>
  <component
    :is="component"
    :style="{
      opacity,
      transition: 'opacity 1000ms ease-out',
    }"
    v-show="show"
    @transitionend="transitionend"
  >
    <slot></slot>
  </component>
</template>

<script>
export default {
  props: {
    display: Boolean,
    component: {
      type: [Object, String],
      default: "span",
    },
  },
  data() {
    return {
      show: this.display,
      opacity: 0,
    };
  },
  watch: {
    display(val) {
      if (val) {
        this.show = true;
        setTimeout(() => (this.opacity = 1), 20);
      } else {
        this.opacity = 0;
      }
    },
  },
  methods: {
    transitionend() {
      if (this.display) {
        this.$emit("update:display", false);
      } else {
        this.show = false;
      }
    },
  },
};
</script>
