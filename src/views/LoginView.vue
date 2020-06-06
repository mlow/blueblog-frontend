<template>
  <div id="outer">
    <div id="login-container" class="paper">
      <form @submit.prevent="submit">
        <div>
          <label for="name">Username</label>
          <br />
          <input type="text" id="name" v-model="form.username" />
        </div>
        <div>
          <label for="password">Password</label>
          <br />
          <input type="password" id="password" v-model="form.password" />
        </div>
        <div class="form-controls">
          <span>
            <button type="submit">Login</button>
            <span v-if="!!error" v-html="error" class="error" />
          </span>
          <button type="button" @click="cancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BlankLayout from "../layouts/BlankLayout";

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      error: ""
    };
  },
  methods: {
    submit() {
      this.$store
        .dispatch("login", this.form)
        .then(() => {
          this.$router.push({ name: "main" });
        })
        .catch(error => {
          if (Object.prototype.hasOwnProperty.call(error, "graphQLErrors")) {
            this.error = error.graphQLErrors[0].message;
          } else {
            this.error = error.message;
          }
        });
    },
    cancel() {
      this.$router.push({ name: "main" });
    }
  },
  created() {
    this.$emit("update:layout", BlankLayout);
  }
};
</script>

<style lang="scss" scoped>
#login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  overflow: auto;
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
    margin: 12px -4px -4px -4px;
    > * {
      margin: 4px;
    }
  }
}
</style>
