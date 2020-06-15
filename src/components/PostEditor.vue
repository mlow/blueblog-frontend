<template>
  <div>
    <form class="form-control">
      <div class="form-group">
        <DateTimeInput style="width:180px" v-model="post.publish_date" />
      </div>
      <div class="form-group">
        <input
          style="width:100%"
          v-model="post.title"
          type="text"
          placeholder="Title"
        />
      </div>
      <div class="form-group">
        <textarea
          style="width:100%"
          oninput="this.style.height = '';this.style.height = this.scrollHeight + 'px'"
          v-model="post.content"
          placeholder="Write your thoughts..."
        />
      </div>
      <div class="form-group flex flex-between">
        <span>
          <button type="button" @click="saveEvent">{{ saveButtonLabel }}</button>
          <span v-if="!!error" class="error">{{ error }}</span>
        </span>
        <button type="button" @click="$emit('cancel')">Cancel</button>
      </div>
    </form>
    <PostDraft v-bind="post" />
  </div>
</template>

<script>
import PostDraft from "./PostDraft";
import DateTimeInput from "./DateTimeInput";

export default {
  data() {
    return {
      post: {
        title: this.title,
        content: this.content,
        publish_date: this.publish_date,
        is_published: true,
      },
      error: "",
    };
  },
  props: {
    id: {
      required: false,
    },
    title: String,
    content: String,
    publish_date: Date,
  },
  methods: {
    saveEvent() {
      if (this.id) {
        this.$emit("edit", this.id, this.post);
      } else {
        this.$emit("publish", this.post);
      }
    },
  },
  computed: {
    saveButtonLabel() {
      return this.id ? "Edit" : "Publish";
    },
  },
  components: {
    PostDraft,
    DateTimeInput,
  },
};
</script>
