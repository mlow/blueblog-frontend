<template>
  <div class="collapsible">
    <span
      class="collapsible-label"
      :class="'collapsible-' + (expanded ? 'expanded' : 'collapsed')"
      @click="expanded = !expanded"
    >{{ label }}</span>
    <div v-if="expanded" class="collapsible-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
  },
  data() {
    return {
      expanded: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.collapsible {
  .collapsible &-label {
    cursor: pointer;
  }
  .collapsible &-content {
    padding-left: 1rem;
  }
  .collapsible &-collapsed:before {
    content: "▸ ";
  }
  .collapsible &-expanded:before {
    content: "▾ ";
  }
}
</style>
