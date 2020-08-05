<template>
  <div class="collapsible">
    <span
      class="collapsible-label"
      :class="'collapsible-' + (expanded ? 'expanded' : 'collapsed')"
      :style="labelStyle"
      @click="expanded = !expanded"
    >
      {{ label }}
    </span>
    <div v-if="expanded" class="collapsible-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    labelStyle: {
      type: Object,
    },
    initiallyExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: this.initiallyExpanded,
    };
  },
};
</script>

<style lang="scss" scoped>
.collapsible {
  & > &-label {
    cursor: pointer;
  }
  & > &-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  & > &-collapsed:before {
    content: "▸ ";
  }
  & > &-expanded:before {
    content: "▾ ";
  }
}
</style>
