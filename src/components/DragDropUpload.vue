<template>
  <div
    class="drag-drop-zone"
    @dragover.prevent
    @dragenter.prevent
    @drop.prevent="handleFileDrop"
    @click="triggerFileInput"
  >
    <p v-if="!file">
      Arrastra y suelta el archivo aquí, o haz clic para seleccionar uno
    </p>
    <p v-else>{{ file.name }}</p>
    <input
      type="file"
      class="form-control"
      id="file"
      ref="fileInput"
      @change="handleFileUpload"
      style="display: none"
    />
  </div>
</template>

<script>
export default {
  emits: ['file-dropped', 'file-uploaded'],
  name: "DragDropUpload",
  props: {
    file: {
      type: Object,
      default: null
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileDrop(event) {
      this.$emit("file-dropped", event.dataTransfer.files[0]);
    },
    handleFileUpload(event) {
      this.$emit("file-uploaded", event.target.files[0]);
    }
  }
};
</script>

<style scoped>
.drag-drop-zone {
  border: 2px dashed #007bff;
  border-radius: 0.25rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
}
.drag-drop-zone p {
  margin: 0;
  color: #6c757d;
}
.drag-drop-zone:hover {
  background-color: #f1f1f1;
}
</style>