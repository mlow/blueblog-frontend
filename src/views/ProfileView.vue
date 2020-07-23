<template>
  <form class="form-control" @submit.prevent="submit">
    <div class="form-group" style="margin-bottom: 1.5rem;">
      <label for="password">Current Password</label>
      <br />
      <input
        type="password"
        id="password"
        placeholder="Enter your current password"
        v-model="input.password"
      />
    </div>
    <div class="form-group">
      <label for="name">Username</label>
      <br />
      <input type="text" id="name" v-model="input.username" />
    </div>
    <div class="form-group">
      <label for="name">Name</label>
      <br />
      <input type="text" id="name" v-model="input.name" />
    </div>
    <div class="form-group" style="margin-top: 1.5rem">
      <label for="new-password">New Password</label>
      <br />
      <input type="password" id="new-password" v-model="input.new_password" />
    </div>
    <div class="form-group">
      <label for="new-password-repeat">New Password Repeated</label>
      <br />
      <input
        type="password"
        id="new-password-repeat"
        v-model="new_password_repeat"
      />
    </div>
    <div style="margin-top: 1rem;" class="form-group flex flex-between">
      <button type="submit">Save</button>
      <button type="button" @click="cancel">Return</button>
    </div>
    <div style="margin-top: 1rem;" class="error" v-if="error" v-html="error" />
  </form>
</template>

<script>
import { updateAuthor } from "../graphql/author.gql";

export default {
  data() {
    const userData = this.$store.getters.userData;

    return {
      input: {
        name: userData.author.name,
        username: userData.author.username,
        password: "",
        new_password: "",
      },
      new_password_repeat: "",
      error: "",
    };
  },
  methods: {
    submit() {
      if (!this.input.password) {
        this.error = "Current password required.";
        return;
      }
      if (this.input.new_password !== this.new_password_repeat) {
        this.error = "New passwords don't match.";
        return;
      }
      if (!this.input.username) {
        this.error = "Username can't be blank.";
        return;
      }
      if (!this.input.name) {
        this.error = "Name can't be blank.";
        return;
      }

      this.$apollo
        .mutate({
          mutation: updateAuthor,
          variables: {
            input: this.input,
          },
        })
        .then(() => {
          this.error = "";
          alert("Success!");
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
