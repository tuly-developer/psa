<template>
  <div></div>
</template>

<script>
export default {
  props: {
    file: {
      type: [File, null],
      required: true
    },
    allowedExtensions: {
      type: Array,
      default: () => ['xlsx', 'xls']
    }
  },
  methods: {
    validate() {
      if (!this.file) {
        this.$emit('error', 'Por favor, seleccione un archivo para importar.');
        return false;
      }

      const fileExtension = this.file.name.split('.').pop().toLowerCase();
      if (!this.allowedExtensions.includes(fileExtension)) {
        this.$emit('error', 'El archivo seleccionado no es un archivo Excel válido. Por favor, seleccione un archivo con extensión .xlsx o .xls.');
        return false;
      }

      return true;
    }
  }
}
</script>
