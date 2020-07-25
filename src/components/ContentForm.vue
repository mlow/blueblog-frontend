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
        <span
          :style="{
            'margin-left': '1rem',
            transition: 'opacity 1000ms ease',
            opacity: this.showDraftSaved ? 1 : 0,
          }"
          @transitionend="showDraftSaved = false"
        >Draft saved</span>
      </span>
      <button type="button" @click="$emit('cancel')">Cancel</button>
    </div>
    <DraftList
      :draft="{ title, content }"
      :selectFirstLoaded="loadFirstDraft"
      @draft:selected="updateDraft"
      @draft:saved="showDraftSaved = true"
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
  data() {
    return {
      showDraftSaved: false,
    };
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
.drafts {
  margin-top: 1rem;
}
</style>
