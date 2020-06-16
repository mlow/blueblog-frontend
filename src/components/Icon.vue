<template>
  <span :class="iconClass">
    <router-link v-if="route" :to="route">
      <FaIcon :icon="faIcon" :size="size" />
    </router-link>
    <FaIcon v-else :icon="faIcon" :size="size" />
  </span>
</template>

<script>
export default {
  props: {
    icon: String,
    size: {
      type: String,
      default: "lg",
    },
    route: String,
  },
  computed: {
    iconClass() {
      return ["icon", "icon-" + this.icon];
    },
    faIcon() {
      switch (this.icon) {
        case "feather":
          return "feather-alt";
        case "book":
          return "book";
        case "edit":
          return "pencil-alt";
        case "delete":
          return "times";
        case "user-profile":
          return "user";
        case "sign-out":
          return "sign-out-alt";
        case "sign-in":
          return "sign-in-alt";
        default:
          return undefined;
      }
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
