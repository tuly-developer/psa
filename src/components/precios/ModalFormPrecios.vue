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
          <h5 class="modal-title" id="exampleModalLabel">
            Importar Archivo - {{ subMenu.label }}
          </h5>
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
              <label for="file" class="form-label">Subir Archivo Excel</label>
              <drag-drop-upload
                :file="formData.file"
                @file-dropped="handleFileDrop"
                @file-uploaded="handleFileUpload"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-else>Importar {{ subMenu.label }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <file-validator
    ref="fileValidator"
    :allowedExtensions="allowedExtensions"
    :file="formData.file"
    @error="handleError"
  />
  <user-confirmation
    ref="userConfirmation"
    :message="`¿Está seguro que el archivo excel seleccionado es de ${subMenu.label} y desea importarlo?`"
  />
  <loading-alert
    ref="loadingAlert"
    title="Aguarde un instante!"
    message="Realizando importación..."
  />
  <file-uploader
    ref="fileUploader"
    url="prices/import"
    :formData="formData"
    @success="handleSuccess"
    :hasTitle="false"
    @error="handleError"
  />
</template>

<script>
import { Modal } from "bootstrap";
import DragDropUpload from "@/components/DragDropUpload.vue";
import FileValidator from "@/components/import/FileValidator.vue";
import UserConfirmation from "@/components/import/UserConfirmation.vue";
import LoadingAlert from "@/components/import/LoadingAlert.vue";
import FileUploader from "@/components/import/FileUploader.vue";
import Swal from 'sweetalert2';

export default {
  name: "ModalFormPrecios",
  components: {
    DragDropUpload,
    FileValidator,
    UserConfirmation,
    LoadingAlert,
    FileUploader,
  },
  props: {
    subMenu: {
      type: Object,
      default: () => ({})
    }
  },
    emits: ['import-completed', 'export-completed', 'close-modal'],
  data() {
    return {
      loading: false,
      formData: {
        file: null,
        type: this.subMenu.value,
      },
      allowedExtensions: ['xlsx', 'xls', 'csv'],
    };
  },
  computed: {

  },
  methods: {
    handleFileDrop(file) {
      this.formData.file = file;
    },
    handleFileUpload(file) {
      this.formData.file = file;
    },
    async handleSubmit() {
      if (this.$refs.fileValidator.validate()) {
        const confirmed = await this.$refs.userConfirmation.confirm();
        if (!confirmed) return;

        this.$refs.loadingAlert.show();

        try {
          const response = await this.$refs.fileUploader.upload();
          console.log("Upload successful:", response);
          this.hideModal();
        } catch (error) {
          console.error("Upload failed:", error);
        } finally {
          this.$refs.loadingAlert.close();
        }
      }
    },

    handleSuccess(response) {
      this.$emit("import-completed", response);
    },
    
    showModal() {
      this.modal = new Modal(document.getElementById("PriceModal"));
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },


    handleError(error) {
      console.error("Upload failed:", error);
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
      });
    },
  },
/*   watch: {
    subMenu: {
      handler(newVal) {
        this.formData.type = newVal.value;
      },
      deep: true,
      immediate: true
    }
  }, */
  mounted() {
    this.modal = new Modal(document.getElementById("PriceModal"));
  },
};
</script>

<style scoped>
.modal-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}
.modal-title {
  font-size: 1.25rem;
  font-weight: 500;
}
.modal-body {
  padding: 1.5rem;
}
.form-label {
  font-weight: 500;
}
.form-control,
.form-select {
  border-radius: 0.25rem;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}
.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
.spinner-border {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}
</style>