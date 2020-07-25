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
      <textarea
        style="width:100%"
        ref="content"
        :value="content"
        @input="$emit('update:content', $event.target.value)"
        placeholder="Write your thoughts..."
      />
    </div>
    <slot name="after"></slot>
    <div class="form-group flex flex-between">
      <span>
        <button type="submit">{{ submitLabel }}</button>
        <span v-if="!!error" class="error">{{ error }}</span>
      </span>
      <button type="button" @click="$emit('cancel')">Cancel</button>
    </div>
    <DraftList
      :draft="{ title: this.title, content: this.content }"
      :selectFirstLoaded="loadFirstDraft"
      @draft:selected="updateDraft"
      v-on="$listeners"
    />
  </form>
</template>

<script>
import DraftList from "./DraftList.vue";

export default {
  props: {
    title: String,
    content: String,
    error: String,
    submitLabel: String,
    loadFirstDraft: Boolean,
  },
  methods: {
    updateDraft(draft) {
      this.$emit("update:title", draft.title);
      this.$emit("update:content", draft.content);
    },
    fitTextareaToContent(target) {
      target.style.height = "";
      target.style.height = target.scrollHeight + "px";
    },
  },
  watch: {
    content: {
      handler() {
        setTimeout(() => this.fitTextareaToContent(this.$refs.content));
      },
      // immediate so this gets fired upon creation as well
      immediate: true,
    },
  },
  components: {
    DraftList,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";
</style>
