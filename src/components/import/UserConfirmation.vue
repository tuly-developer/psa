<template>
  <div></div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    async confirm() {
      const result = await Swal.fire({
        title: 'Confirmación',
        text: this.message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      });

      return result.isConfirmed;
    }
  }
}
</script>