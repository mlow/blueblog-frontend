<template>
  <form class="form-control" @submit.prevent="$emit('submit')">
    <slot name="before"></slot>
    <div class="form-group">
      <input
        style="width:100%"
        type="text"
        :value="title"
        @input="$emit('update:title', $event.target.value)"
        placeholder="Title"
      />
    </div>
    <div class="form-group">
      <ResizingTextarea
        style="width:100%"
        :value="content"
        @input="$emit('update:content', $event)"
        placeholder="Write your thoughts..."
      />
    </div>
    <slot name="after"></slot>
    <div class="form-group flex flex-between">
      <div class="controls-left">
        <button type="submit">{{ submitLabel }}</button>
        <span v-if="!!error" class="error">{{ error }}</span>
        <slot name="controls"></slot>
      </div>
      <button type="button" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<script>
import ResizingTextarea from "./ResizingTextarea";

export default {
  props: {
    title: String,
    content: String,
    error: String,
    submitLabel: String,
  },
  components: {
    ResizingTextarea,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";
.controls-left {
  > * {
    margin-right: 0.5rem;
  }
}
</style>
