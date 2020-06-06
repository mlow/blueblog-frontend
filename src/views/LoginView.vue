<template>
  <div></div>
</template>

<script>
import BlankLayout from "../layouts/BlankLayout";

export default {
  created() {
    this.$emit("update:layout", BlankLayout);
  }
};
</script>

<style lang="scss" scoped>
</style>
