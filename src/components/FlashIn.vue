<template>
  <component
    :is="component"
    :style="{
      opacity: display ? 1 : 0,
      transition: 'opacity 1000ms ease',
    }"
    @transitionend="$emit('update:display', false)"
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
};
</script>
