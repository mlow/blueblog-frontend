<template>
  <input type="text" v-model="displayed" @blur="blur" @focus="focus" />
</template>

<script>
import date from "date-and-time";

export default {
  props: {
    value: Date,
    format: {
      type: String,
      default: "YYYY-MM-DD HH:mm",
    },
    placeholder: String,
  },
  data() {
    return {
      active: false,
      workingDate: this.value || new Date(),
    };
  },
  watch: {
    value(value) {
      this.workingDate = value;
    },
  },
  computed: {
    displayed: {
      get() {
        if (this.active) {
          return this.working;
        } else {
          return this.valid() ? this.formatted() : "Invalid date";
        }
      },
      set(input) {
        this.working = input;
        this.workingDate = new Date(input);
        if (this.valid()) {
          this.$emit("input", this.workingDate);
        }
      },
    },
  },
  methods: {
    valid() {
      return this.workingDate.toString() !== "Invalid Date";
    },
    reset() {
      this.workingDate = new Date();
      this.working = this.formatted();
      this.$emit("input", this.workingDate);
    },
    formatted() {
      return date.format(this.workingDate, this.format);
    },
    validate() {
      if (this.valid()) {
        this.working = this.formatted();
      } else if (!this.working) {
        this.reset();
      }
    },
    focus() {
      this.validate();
      this.active = true;
    },
    blur() {
      this.validate();
      this.active = false;
    },
  },
};
</script>
