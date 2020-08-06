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
        return this.value.toISOString().split("T")[0];
      },
      set(value) {
        this.$emit("input", value ? new Date(value) : null);
      },
    },
  },
};
</script>
