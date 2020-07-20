<template>
  <div id="profile-container" class="paper">
    <form @submit.prevent="submit">
      <div style="margin-bottom: 1.5rem;">
        <label for="password">Current Password</label>
        <input type="password" id="password" v-model="input.password" />
      </div>
      <div>
        <label for="name">Username</label>
        <input type="text" id="name" v-model="input.username" />
      </div>
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" v-model="input.name" />
      </div>
      <div style="margin-top: 1.5rem">
        <label for="new-password">New Password</label>
        <input type="password" id="new-password" v-model="input.new_password" />
      </div>
      <div>
        <label for="new-password-repeat">New Password Repeated</label>
        <input
          type="password"
          id="new-password-repeat"
          v-model="new_password_repeat"
        />
      </div>
      <div class="form-controls">
        <span>
          <button type="submit">Save</button>
          <span v-if="!!error" v-html="error" class="error" />
        </span>
        <button type="button" @click="cancel">Return</button>
      </div>
    </form>
  </div>
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
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: "main" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#profile-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
}

form {
  margin: 2em;
  div {
    margin: 8px 0;

    .error {
      margin-left: 0.75em;
      color: #ce1111;
    }
  }

  div input {
    width: 100%;
  }

  div.form-controls {
    display: flex;
    justify-content: space-between;
    margin: 1.5rem -4px -4px -4px;
    > * {
      margin: 4px;
    }
  }
}
</style>
