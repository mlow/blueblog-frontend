<template>
  <form class="form-control" @submit.prevent="submit">
    <div class="form-group">
      <label for="name">Username</label>
      <br />
      <input
        type="text"
        id="username"
        :placeholder="userData.author.username"
        v-model="form.username"
      />
    </div>
    <div class="form-group">
      <label for="name">Name</label>
      <br />
      <input
        type="text"
        id="name"
        :placeholder="userData.author.name"
        v-model="form.name"
      />
    </div>
    <div class="form-group" style="margin-top: 1.5rem">
      <label for="new-password">New Password</label>
      <br />
      <input type="password" id="new-password" v-model="form.new_password" />
    </div>
    <div class="form-group" style="margin-bottom: .75rem;">
      <label for="new-password-repeat">New Password Repeated</label>
      <br />
      <input
        type="password"
        id="new-password-repeat"
        v-model="form.new_password_repeat"
      />
    </div>
    <hr />
    <div class="form-group" style="margin-top: .75rem;">
      <label for="password">Current Password</label>
      <br />
      <input
        type="password"
        id="password"
        placeholder="Enter your current password"
        v-model="form.password"
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        name: "",
        username: "",
        password: "",
        new_password: "",
        new_password_repeat: "",
      },
      error: "",
    };
  },
  computed: {
    ...mapGetters(["userData"]),
  },
  methods: {
    clear() {
      this.form = {
        name: "",
        username: "",
        password: "",
        new_password: "",
        new_password_repeat: "",
      };
      this.error = "";
    },
    submit() {
      if (!this.form.password) {
        this.error = "Current password required.";
        return;
      }
      if (this.form.new_password !== this.form.new_password_repeat) {
        this.error = "New passwords don't match.";
        return;
      }
      if (!(this.form.new_password || this.form.name || this.form.username)) {
        this.error = "No changes to save.";
        return;
      }

      this.$store
        .dispatch("updateProfile", this.form)
        .then(() => {
          this.clear();
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
