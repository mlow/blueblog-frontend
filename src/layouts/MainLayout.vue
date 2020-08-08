<template>
  <div class="paper container">
    <span class="user-controls">
      <template v-if="loggedIn">
        <Icon
          icon="feather"
          v-show="!isAuthoringRoute"
          :route="{ name: isJournalRoute ? 'journal:new' : 'blog:new' }"
        />
        <Icon icon="book" :route="{ name: 'journal:view' }" />
        <Icon icon="user-profile" route="/profile" />
        <Icon icon="sign-out" route="/logout" />
      </template>
      <Icon v-else icon="sign-in" :route="loginRoute" />
    </span>

    <header class="logo">
      <router-link to="/">Blue Blog</router-link>
    </header>

    <div id="content">
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
    isJournalRoute() {
      return this.$route.matched[0].path === "/journal";
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

<style lang="scss" scoped>
.logo a {
  text-decoration: inherit;
  color: inherit;
  outline: none;
}

#content {
  margin: 1rem;
  @media (min-width: 768px) {
    margin: 2rem;
  }
  ::v-deep main > h2 {
    margin: 0;
  }
}
</style>
