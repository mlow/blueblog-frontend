<template>
  <form class="form-control" @submit.prevent="submit">
    <div class="form-group">
      <label for="name">Username</label>
      <br />
      <input type="text" id="name" v-model="form.username" />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <br />
      <input type="password" id="password" v-model="form.password" />
    </div>
    <div style="margin-top: 1rem;" class="form-group flex flex-between">
      <button type="submit">Login</button>
      <button type="button" @click="cancel">Cancel</button>
    </div>
    <div style="margin-top: 1rem;" class="error" v-if="error" v-html="error" />
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      error: undefined,
    };
  },
  methods: {
    submit() {
      if (!this.form.username || !this.form.password) {
        this.error = "Fill in your username and password.";
        return;
      }

      this.$store
        .dispatch("login", this.form)
        .then(() => {
          this.$router.redirectOrMain();
        })
        .catch((error) => {
          if (Object.prototype.hasOwnProperty.call(error, "graphQLErrors")) {
            this.error = error.graphQLErrors[0].message;
          } else {
            this.error = error.message;
          }
        });
    },
    cancel() {
      this.$router.goBackOrMain();
    },
  },
};
</script>

<style src="@/assets/styles/form.scss" lang="scss" scoped />
