<template>
  <div></div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  props: {
    title: {
      type: String,
      default: "Aguarde un instante!"
    },
    message: {
      type: String,
      default: "Realizando importación..."
    }
  },
  methods: {
    show() {
      Swal.fire({
        title: this.title,
        icon: "info",
        showCloseButton: false,
        width: 700,
        html: `
          <div style="display: flex; align-items: center; justify-content: center;">
            <div class="spinner-border" role="status" style="margin-right: 10px;">
              <span class="sr-only">Loading...</span>
            </div>
            <span>${this.message}</span>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
    },
    close() {
      Swal.close();
    }
  }
}
</script>
