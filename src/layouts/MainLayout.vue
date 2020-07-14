<template>
  <div id="container" class="paper">
    <span id="user-controls">
      <template v-if="loggedIn">
        <Icon icon="feather" v-show="!authoring" @click="authoring = true" />
        <Icon icon="book" />
        <Icon icon="user-profile" route="/profile" />
        <Icon icon="sign-out" route="/logout" />
      </template>
      <Icon v-else icon="sign-in" route="/login" />
    </span>

    <div id="content">
      <header id="header">
        <span class="blog_title">Blue Blog</span>
      </header>

      <slot />
    </div>
  </div>
</template>

<script>
import Icon from "../components/Icon.vue";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["loggedIn"]),
  },
  components: {
    Icon,
  },
};
</script>
