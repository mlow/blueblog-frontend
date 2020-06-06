<template>
  <component :is="layout">
    <router-view :layout.sync="layout" />
  </component>
</template>

<script>
export default {
  name: "App",
  data: () => {
    return {
      // The layout (element/component) that is rendered within the <component>
      // The layout is expected to have a slot which is filled by the view
      // which gets passed in by the router.
      layout: "div"
    };
  }
};
</script>

<style lang="scss">
@import "./assets/style.scss";
</style>
