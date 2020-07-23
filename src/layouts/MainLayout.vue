<template>
  <div class="paper container">
    <span class="user-controls">
      <template v-if="loggedIn">
        <Icon icon="feather" v-show="!authoring" :route="{ name: 'blog:new' }" />
        <Icon icon="book" />
        <Icon icon="user-profile" route="/profile" />
        <Icon icon="sign-out" route="/logout" />
      </template>
      <Icon v-else icon="sign-in" route="/login" />
    </span>

    <div class="content">
      <header class="logo">Blue Blog</header>

      <router-view />
    </div>
  </div>
</template>

<script>
import Icon from "../components/Icon.vue";
import { mapGetters } from "vuex";

export default {
  name: "MainLayout",
  computed: {
    ...mapGetters(["loggedIn"]),
    ...mapGetters("ui", ["authoring"]),
  },
  components: {
    Icon,
  },
};
</script>
