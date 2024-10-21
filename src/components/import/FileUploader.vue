<template>
  <div></div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  emits: ['success', 'error'],
  props: {
    url: {
      type: String,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
      validator: function (value) {
        return Object.prototype.hasOwnProperty.call(value, 'file') && Object.prototype.hasOwnProperty.call(value, 'type');
      }
    },
    hasTitle: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    async upload() {
      console.log(this.formData)
      if (!this.formData.file || !this.formData.type || (this.hasTitle && !this.formData.title)) {
        this.$emit("error", new Error("All required fields must be completed"));
        return;
      }

      const formData = new FormData();
      formData.append("file", this.formData.file);
      formData.append("type", this.formData.type);

      if (this.hasTitle) {
        formData.append("title", this.formData.title);
      }

      try {
        const response = await axios.post(this.url, formData);
        this.$emit("success", response);
        return response;
      } catch (error) {
        this.$emit("error", error);
        throw error;
      }
    },
  },
};
</script>
