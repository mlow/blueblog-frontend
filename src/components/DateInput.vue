<template>
  <input type="date" v-model="displayed" />
</template>

<script>
export default {
  props: {
    value: Date,
  },
  computed: {
    displayed: {
      get() {
        if (!this.value) {
          return "";
        }
        const dateString = this.value.toISOString().split("T")[0];
        if (this.value.getTime() % 86400 !== 0) {
          this.$emit("input", new Date(dateString));
        }
        return dateString;
      },
      set(value) {
        this.$emit("input", value ? new Date(value) : null);
      },
    },
  },
};
</script>
