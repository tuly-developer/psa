<template>
  <card-data-component></card-data-component>
  <div class="card ml-4 mt-4">
    <ul class="nav nav-tabs w-100" id="custom-tabs-one-tab" role="tablist">
      <li class="nav-item flex-grow-1">
        <a class="nav-link active text-center" id="custom-tabs-one-safit-tab" data-toggle="pill"
          href="#custom-tabs-one-safit" role="tab" aria-controls="custom-tabs-one-safit" aria-selected="true">
          <h5>Safit</h5>
        </a>
      </li>
      <li class="nav-item flex-grow-1">
        <a class="nav-link text-center" id="custom-tabs-one-payment-tab" data-toggle="pill"
          href="#custom-tabs-one-payment" role="tab" aria-controls="custom-tabs-one-payment" aria-selected="false">
          <h5>Cobranzas</h5>
        </a>
      </li>
      <li class="nav-item flex-grow-1">
        <a class="nav-link text-center" id="custom-tabs-one-targz-tab" data-toggle="pill" href="#custom-tabs-one-targz"
          role="tab" aria-controls="custom-tabs-one-targz" aria-selected="false">
          <h5>Rendiciones</h5>
        </a>
      </li>
    </ul>
    <div class="tab-content" id="custom-tabs-one-tabContent">
      <!-- Safit tab -->
      <div class="tab-pane fade show active" id="custom-tabs-one-safit" role="tabpanel"
        aria-labelledby="custom-tabs-one-safit-tab">
        <br>
        <div class="drop-zone" @click="openFileDialog('xls')" @dragover.prevent @dragenter.prevent
          @drop.prevent="handleDrop($event, 'xls')">
          <br>
          <i class="fa-regular fa-copy fa-6x"></i>
          <br><br>
          <small>
            <p v-if="!fileName.xls">Arrastra y suelta el archivo aquí o haz clic para seleccionar uno</p>
            <p v-if="fileName.xls">Archivo seleccionado: {{ fileName.xls }}</p>
          </small>
          <br>
        </div>
        <br>
        <form @submit.prevent="uploadFile('xls', 'safit')" class="text-center">
          <input type="file" class="d-none" id="xlsFileInput" ref="xlsFileInput"
            @change="onFileChange($event, 'xls')" />
          <button type="submit" class="btn btn-primary">Subir Archivo</button>
        </form>
      </div>

      <!-- Cobranzas tab -->
      <div class="tab-pane fade" id="custom-tabs-one-payment" role="tabpanel"
        aria-labelledby="custom-tabs-one-payment-tab">
        <br>
        <div class="drop-zone" @click="openFileDialog('xls')" @dragover.prevent @dragenter.prevent
          @drop.prevent="handleDrop($event, 'xls')">
          <br>
          <i class="fa-regular fa-copy fa-6x"></i>
          <br><br>
          <small>
            <p v-if="!fileName.xls">Arrastra y suelta el archivo aquí o haz clic para seleccionar uno</p>
            <p v-if="fileName.xls">Archivo seleccionado: {{ fileName.xls }}</p>
          </small>
          <br>
        </div>
        <br>
        <form @submit.prevent="uploadFile('xls', 'payment')" class="text-center">
          <input type="file" class="d-none" id="xlsFileInput" ref="xlsFileInput"
            @change="onFileChange($event, 'xls')" />
          <button type="submit" class="btn btn-primary">Subir Archivo</button>
        </form>
      </div>

      <!-- Rendiciones tab -->
      <div class="tab-pane fade" id="custom-tabs-one-targz" role="tabpanel" aria-labelledby="custom-tabs-one-targz-tab">
        <br>
        <div class="drop-zone" @click="openFileDialog('tar')" @dragover.prevent @dragenter.prevent
          @drop.prevent="handleDrop($event, 'tar')">
          <br>
          <i class="fa-regular fa-copy fa-6x"></i>
          <br><br>
          <small>
            <p v-if="!fileName.tar">Arrastra y suelta el archivo elegido para cargar sus archivos o haz clic para
              seleccionar uno</p>
            <p v-if="fileName.tar">{{ fileName.tar }}</p>
          </small>
          <br>
        </div>
        <br>
        <form @submit.prevent="uploadFile('tar', 'targz')" class="text-center">
          <input type="file" class="d-none" id="tarFileInput" ref="tarFileInput"
            @change="onFileChange($event, 'tar')" />
          <button type="submit" class="btn btn-primary">Subir Archivo</button>
        </form>
      </div>
      <br>
    </div>
  </div>


  <br>
</template>

<script>
import Swal from 'sweetalert2';
import CardDataComponent from '/src/layouts/inc/CardDataComponent.vue'
import axios from "@/plugins/axios";
import moment from 'moment';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default {
  components: {
    CardDataComponent,
  },

  data() {
    return {
      file: {
        tar: null,
        xls: null,
        htm: null
      },
      fileName: {
        tar: '',
        xls: '',
        htm: ''
      },
      files: [],
      loading: false,
      error: null,
      lastPage: 1,
      currentPage: 1,
      perPage: 5,
      hasMorePages: false,
      searchTerm: "",
    };
  },
  mounted() {
    this.fetchFiles();
  },

  computed: {
    filteredPrices() {
      if (!this.searchTerm) return this.files;

      const lowerCaseSearch = this.searchTerm.toLowerCase();
      return this.files.filter(
        (file) =>
          // (file.nombre_archivo && file.nombre_archivo.toLowerCase().includes(lowerCaseSearch)) ||
          (file.nombre_archivo && file.nombre_archivo.toLowerCase().includes(lowerCaseSearch))
      );
    },
  },
  watch: {
    searchTerm() {
      this.fetchFiles(1); // Ejecuta la función fetchFiles con la primera página cuando cambie el término de búsqueda
    },
    // searchTerm: {
    //   handler: "fetchFiles",
    //   immediate: false,
    // },
  },
  methods: {
    openFileDialog(type) {
      this.$refs[type + 'FileInput'].click();
    },
    onFileChange(event, type) {
      const file = event.target.files[0];
      this.validateFile(file, type, event);
    },
    handleDrop(event, type) {
      const file = event.dataTransfer.files[0];
      this.validateFile(file, type, event);
    },
    validateFile(file, type, event) {
      const allowedExtensions = {
        'tar': ['tar.gz'],
        'xls': ['xls'],
        'htm': ['htm']
      };

      if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isValid = type === 'tar' ? (file.name.endsWith('.tar.gz')) : allowedExtensions[type].includes(fileExtension);

        if (isValid) {
          this.file[type] = file;
          this.fileName[type] = file.name;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Archivo no válido',
            text: `Por favor, selecciona un archivo ${type.toUpperCase()} válido.`,
          });
          event.target.value = '';  // Reset the file input
          this.file[type] = null;
          this.fileName[type] = '';
        }
      }
    },
    uploadFile(type, fileType) {

      if (!this.file[type]) {
        Swal.fire({
          icon: 'warning',
          title: 'No hay archivo',
          text: `Por favor, selecciona un archivo ${type.toUpperCase()} primero.`,
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", this.file[type]);
      formData.append("fileType", fileType);

      let url = null;
      switch (fileType) {
        case 'safit':
          url = process.env.DASHBOARD_BACKEND_URL ? process.env.DASHBOARD_BACKEND_URL + '/api/v1/file-manager/safit' : null;
          // if((this.fileName[type]).includes('safit')){
          //   Swal.fire({
          //     icon: 'warning',
          //     title: this.fileName[type],
          //     text: `Por favor verifique el nombre del archivo seleccionado`,
          //   });
          //   return;
          // }
          break;
        case 'payment': // Cobranzas
          url = process.env.DASHBOARD_BACKEND_URL ? process.env.DASHBOARD_BACKEND_URL + '/api/v1/file-manager/payment/upload' : null;
          break;
        case 'targz': // Rendiciones
          url = process.env.DASHBOARD_BACKEND_URL ? process.env.DASHBOARD_BACKEND_URL + '/api/v1/file-manager/targz/upload' : null;
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar archivo',
            text: `Archivo no valido para su procesamiento, contacte con el soporte de la página`,
          });
          break;
      }

      if (!url) {
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar archivo',
          text: `Por favor, contacte con el soporte de la página`,
        });
        return;
      }

      Swal.fire({
        title: "Aguarde un instante!",
        icon: "info",
        showCloseButton: false,
        width: 700,
        html: `
            <div style="display: flex; align-items: center; justify-content: center; height: 100px;">
              <div class="spinner-border" role="status" style="width: 3rem; height: 3rem; margin-right: 10px;">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          `,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(response => {
          return response.json().then(data => {
            if (!response.ok) {
              throw new Error(data.error || 'Error al subir el archivo.');
            }
            return data;
          });
        })
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: data.message || "Archivo subido exitosamente.",
          });

          // Limpiar el input file
          this.$refs[type + 'FileInput'].value = '';  // 'tarFileInput' o 'xlsFileInput'
          this.file[type] = null;  // Reiniciar el archivo seleccionado
          this.fileName[type] = ''; // Reiniciar el nombre del archivo seleccionado
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || "Error al subir el archivo.",
          });
          console.error("Error al subir el archivo:", error);
          this.$refs[type + 'FileInput'].value = '';  // 'tarFileInput' o 'xlsFileInput'
          this.file[type] = null;  // Reiniciar el archivo seleccionado
          this.fileName[type] = ''; // Reiniciar el nombre del archivo seleccionado
        });
    },

    async fetchFiles(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get("api/v1/file-manager/files", {
          params: {
            page: page,
            perPage: this.perPage,
            search: this.searchTerm,
          },
          withCredentials: false,
        });
        if (response.data) {
          this.files = response.data.data;
          this.currentPage = response.data.current_page;
          this.hasMorePages = response.data.next_page_url !== null;
          this.lastPage = response.data.last_page;
        } else {
          this.error = response.data.message;
        }
      } catch (error) {
        this.error = error.response
          ? error.response.data.message
          : error.message;
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      return moment(dateString).format('DD/MM/YYYY HH:mm');
    },
  }
};
</script>


<style>
.card-body {
  margin-left: 5rem;
  margin-right: 5rem;
}

.flex-grow-1 {
  background-color: #f4f6f9;
}

.drop-zone {
  margin-top: 2rem;
  margin-left: 30rem;
  margin-right: 30rem;
  background-color: #e7f4ff;
  color: #6c757d;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.drop-zone p {
  margin: 0;
  color: #6c757d;
}

.drop-zone input {
  display: none;
}
</style>