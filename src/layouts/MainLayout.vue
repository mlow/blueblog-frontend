<template>
  <div class="paper container">
    <span class="user-controls">
      <template v-if="loggedIn">
        <Icon
          icon="feather"
          v-show="!isAuthoringRoute"
          :route="{ name: 'blog:new' }"
        />
        <Icon icon="book" />
        <Icon icon="user-profile" route="/profile" />
        <Icon icon="sign-out" route="/logout" />
      </template>
      <Icon v-else icon="sign-in" :route="loginRoute" />
    </span>

    <div id="content">
      <header class="logo">
        <router-link to="/">Blue Blog</router-link>
      </header>

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
    loginRoute() {
      return {
        name: "login",
        query: {
          redirect: this.$route.fullPath,
        },
      };
    },
    isAuthoringRoute() {
      return this.$route.name.endsWith("new");
    },
    ...mapGetters(["loggedIn"]),
  },
  components: {
    Icon,
  },
};
</script>

<style scoped>
.logo a {
  text-decoration: inherit;
  color: inherit;
  outline: none;
}

#content >>> main {
  padding: 0 2rem;
}
</style>
