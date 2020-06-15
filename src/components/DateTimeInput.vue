<template>
  <input type="text" v-model="displayed" @blur="active = false;" @focus="focus" />
</template>

<script>
import date from "date-and-time";

export default {
  props: {
    value: Date,
    format: {
      type: String,
      default: "YYYY-MM-DD HH:mm:ss",
    },
    placeholder: String,
  },
  data() {
    return {
      active: false,
      working: "",
    };
  },
  computed: {
    displayed: {
      get() {
        if (this.active) {
          return this.working;
        } else {
          return this.value
            ? date.format(this.value, this.format)
            : "Invalid date";
        }
      },
      set(modified) {
        let newValue = modified.trim() ? new Date(modified) : new Date();
        if (newValue.toString() === "Invalid Date") {
          this.working = modified;
          newValue = null;
        }
        this.$emit("input", newValue);
      },
    },
  },
  methods: {
    focus() {
      if (this.value) {
        this.working = date.format(this.value, this.format);
      }
      this.active = true;
    },
  },
};
</script>
