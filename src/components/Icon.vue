<template>
  <span :class="iconClass" @click="$emit('click')">
    <router-link v-if="route" :to="route">
      <FaIcon :icon="faIcon" :size="size" />
    </router-link>
    <FaIcon v-else :icon="faIcon" :size="size" />
  </span>
</template>

<script>
const ICONS = {
  feather: "feather-alt",
  book: "book",
  edit: "pencil-alt",
  delete: "times",
  "user-profile": "user",
  "sign-in": "sign-in-alt",
  "sign-out": "sign-out-alt",
};

export default {
  props: {
    icon: String,
    size: {
      type: String,
      default: "lg",
    },
    route: [String, Object],
  },
  computed: {
    iconClass() {
      return ["icon", "icon-" + this.icon];
    },
    faIcon() {
      return ICONS[this.icon];
    },
  },
};
</script>

<style lang="scss">
.icon {
  &-feather {
    color: lightcoral;
  }

  &-book,
  &-edit {
    color: darkseagreen;
  }

  &-user-profile {
    color: steelblue;
  }

  &-sign-out,
  &-sign-in {
    color: sandybrown;
  }

  &-delete {
    color: palevioletred;
  }

  > a {
    outline: none;
    color: inherit;
  }

  > :hover {
    cursor: pointer;
    opacity: 0.5;
  }
}
</style>
