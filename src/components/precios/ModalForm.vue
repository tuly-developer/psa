<!-- src/components/ModalForm.vue -->
<template>
  <div
    class="modal fade"
    id="PriceModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Agregar Nuevo Item</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="type" class="form-label">Type</label>
              <select
                class="form-control"
                id="type"
                v-model="formData.type"
                required
              >
                <option
                  v-for="option in types"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="file" class="form-label">Subir Archivo Excel</label>
              <input
                type="file"
                class="form-control"
                id="file"
                @change="handleFileUpload"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>Guardar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import axios from "@/plugins/axios";
import Swal from "sweetalert2";

export default {
  name: "ModalForm",
  data() {
    return {
      loading: false,
      formData: {
        type: "",
        file: null,
      },
      types: [
        { value: "1", label: "Autos" },
        { value: "2", label: "Motos" },
      ],
    };
  },
  methods: {
    handleFileUpload(event) {
      this.formData.file = event.target.files[0];
    },
    async handleSubmit() {
      this.loading = true;
      const formData = new FormData();
      formData.append("type", this.formData.type);
      formData.append("file", this.formData.file);

      let url = "prices/import";
      let tituloSwal = "Realizando importación...";

      Swal.fire({
        title: "Aguarde un instante!",
        icon: "info",
        showCloseButton: false,
        width: 700,
        html: `
      <div style="display: flex; align-items: center; justify-content: center;">
        <div class="spinner-border" role="status" style="margin-right: 10px;">
          <span class="sr-only">Loading...</span>
        </div>
        <span>${tituloSwal}</span>
      </div>
    `,
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
      const startTime = new Date().getTime();
      axios({
        url: url,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false,
      })
        .then((response) => {
          console.log(response)
          // Captura el tiempo después de la solicitud
            const endTime = new Date().getTime();

            const duration = endTime - startTime;

            console.log(`Tiemo ${duration} ms en completarse`);
           this.$emit("closeModal");
            Swal.close();
            this.$emit("export-completed", true); 

        })
        .catch(function (error) {
          console.log(error);
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al en la importacion",
            footer: '<a href="">Contacte con el administrador</a>',
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showModal() {
      this.modal = new Modal(document.getElementById("PriceModal"));
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(document.getElementById("PriceModal"));
  },
};
</script>

<style scoped>
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: spinner-border 0.75s linear infinite;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
</style>
