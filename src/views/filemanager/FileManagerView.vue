<template>
  <div class="bg-white">
    <h4 class="text-dark p-5">Gestión de Archivos</h4>
  </div>

  <div class="card ml-4 mt-4">
    <ul class="nav nav-tabs w-100" id="custom-tabs-one-tab" role="tablist">
      <li class="nav-item" style="width: 5rem;">
        <a class="nav-link active text-center" id="custom-tabs-one-safit-tab" data-toggle="pill"
          href="#custom-tabs-one-safit" role="tab" aria-controls="custom-tabs-one-safit" aria-selected="true">
          <strong>Safit</strong>
        </a>
      </li>
      <li class="nav-item" style="width: 8rem;">
        <a class="nav-link text-center" id="custom-tabs-one-payment-tab" data-toggle="pill"
          href="#custom-tabs-one-payment" role="tab" aria-controls="custom-tabs-one-payment" aria-selected="false">
          <strong>Cobranzas</strong>
        </a>
      </li>
      <li class="nav-item" style="width: 8rem;">
        <a class="nav-link text-center" id="custom-tabs-one-targz-tab" data-toggle="pill" href="#custom-tabs-one-targz"
          role="tab" aria-controls="custom-tabs-one-targz" aria-selected="false">
          <strong>Rendiciones</strong>
        </a>
      </li>
    </ul>

    <div class="tab-content" id="custom-tabs-one-tabContent">
      <!-- Safit tab -->
      <div class="tab-pane fade show active" id="custom-tabs-one-safit" role="tabpanel"
        aria-labelledby="custom-tabs-one-safit-tab">
        <br>

        <button type="button" class="btn btn-success float-right mr-2" icon="fas fa-file" data-toggle="modal"
          data-target="#uploadModal">
          <i class="fa-solid fa-upload"></i> Subir Archivos
        </button>

        <div class="modal fade" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <form @submit.prevent="uploadFile('xls', 'safit')" class="text-center">

                <div class="modal-body">
                  <!-- Zona de carga (drop-zone) -->
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
                  <input type="file" class="d-none" id="xlsFileInput" ref="xlsFileInput"
                    @change="onFileChange($event, 'xls')" />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn text-white" style="background-color:#0078D4;">Subir Archivo</button>
                </div>
              </form>

            </div>
          </div>
        </div>

        <br><br>

        <div v-if="loading" class="text-center">Loading...</div>
        <div v-else>
          <table ref="table" class="table" style="width: 100%">
            <thead class="text-secondary">
              <tr>
                <th style="color: silver">Tipo</th>
                <th style="color: silver">Nombre</th>
                <th style="color: silver">Fecha</th>
                <th style="color: silver">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in filteredPrices" :key="data.id">
                <td>
                  <button v-if="data.type === 1" class="btn btn-sm" style="background-color: #b7dfb9; color: #4caf50;">
                    XLS
                  </button>
                  <button v-else-if="data.type === 2" class="btn btn-sm"
                    style="background-color: #b7dfb9; color: #4caf50;">
                    XLS
                  </button>
                  <button v-else class="btn btn-sm" style="background-color: #fdd199; color: #fb8c00;">
                    Tar.gz
                  </button>
                </td>
                <td>{{ data.filename }}</td>
                <td>{{ formatDate(data.created_at) }}</td> <!-- Formato de fecha -->
                <td>
                  <button v-if="data.status === 1" class="btn btn-sm" style="border: 1px solid">
                    <span class="text-secondary">⬤</span> Procesando
                  </button>
                  <button v-else-if="data.status === 2" class="btn btn-sm" style="border: 1px solid">
                    <span class="text-success">⬤</span> Subido
                  </button>
                  <button v-else-if="data.status === 3" class="btn btn-sm" style="border: 1px solid" data-toggle="modal"
                    :data-target="'#errorModal' + data.id">
                    <span class="text-danger">⬤</span> Error en la carga
                  </button>
                  <button v-else class="btn btn-outline-default btn-sm" style="border: 1px solid">
                    <span class="text-secondary">⬤</span> En cola
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Modal para mostrar el error -->
          <div v-for="data in filteredPrices" :key="'modal-' + data.id">
            <div class="modal fade" :id="'errorModal' + data.id" tabindex="-1" role="dialog"
              aria-labelledby="errorModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <!-- <i class="text-danger fa-solid fa-cloud-arrow-up fa-4x"></i> -->
                    <i class="text-danger fa-solid fa-file-excel fa-4x"></i>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <h5 class="modal-title" id="errorModalLabel">Error en la Carga</h5>
                    <br>
                    <small>
                      {{ data.error }}, <strong class="text-danger">es necesario volverlo a cargar.</strong>
                    </small>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button @click="fetchSafitFiles(1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="currentPage === 1">
              Primera
            </button>
            <button @click="fetchSafitFiles(currentPage - 1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="currentPage === 1">
              Anterior
            </button>
            <button @click="fetchSafitFiles(currentPage + 1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="!hasMorePages">
              Siguiente
            </button>
            <button @click="fetchSafitFiles(lastPage)" class="btn btn-sm btn-outline-secondary"
              :disabled="currentPage === lastPage">
              Última
            </button>
          </div>
          <div class="mb-3">
            <span>Página {{ currentPage }} de {{ lastPage }}</span>
          </div>
        </div>



      </div>

      <!-- Cobranzas tab -->
      <div class="tab-pane fade" id="custom-tabs-one-payment" role="tabpanel"
        aria-labelledby="custom-tabs-one-payment-tab">
        <br>

        <button type="button" class="btn btn-success float-right mr-2" icon="fas fa-file" data-toggle="modal"
          data-target="#uploadPaymentModal">
          <i class="fa-solid fa-upload"></i> Subir Archivos
        </button>

        <div class="modal fade" id="uploadPaymentModal" tabindex="-1" aria-labelledby="uploadPaymentModalLabel"
          aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <form @submit.prevent="uploadFile('xls', 'payment')" class="text-center">

                <div class="modal-body">
                  <!-- Zona de carga (drop-zone) -->
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
                  <input type="file" class="d-none" id="xlsFileInput" ref="xlsFileInput"
                    @change="onFileChange($event, 'xls')" />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn text-white" style="background-color:#0078D4;">Subir Archivo</button>
                </div>
              </form>

            </div>
          </div>
        </div>

        <br><br>

        <div v-if="loading" class="text-center">Loading...</div>
        <div v-else>
          <table ref="table" class="table" style="width: 100%">
            <thead class="text-secondary">
              <tr>
                <th style="color: silver">Tipo</th>
                <th style="color: silver">Nombre</th>
                <th style="color: silver">Fecha</th>
                <th style="color: silver">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in filteredPrices" :key="data.id">
                <td>
                  <button v-if="data.type === 1" class="btn btn-sm" style="background-color: #b7dfb9; color: #4caf50;">
                    XLS
                  </button>
                  <button v-else-if="data.type === 2" class="btn btn-sm"
                    style="background-color: #b7dfb9; color: #4caf50;">
                    XLS
                  </button>
                  <button v-else class="btn btn-sm" style="background-color: #fdd199; color: #fb8c00;">
                    Tar.gz
                  </button>
                </td>
                <td>{{ data.filename }}</td>
                <td>{{ formatDate(data.created_at) }}</td> <!-- Formato de fecha -->
                <td>
                  <button v-if="data.status === 1" class="btn btn-sm" style="border: 1px solid">
                    <span class="text-secondary">⬤</span> Procesando
                  </button>
                  <button v-else-if="data.status === 2" class="btn btn-sm" style="border: 1px solid">
                    <span class="text-success">⬤</span> Subido
                  </button>
                  <button v-else-if="data.status === 3" class="btn btn-sm" style="border: 1px solid" data-toggle="modal"
                    :data-target="'#errorModal' + data.id">
                    <span class="text-danger">⬤</span> Error en la carga
                  </button>
                  <button v-else class="btn btn-outline-default btn-sm" style="border: 1px solid">
                    <span class="text-secondary">⬤</span> En cola
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Modal para mostrar el error -->
          <div v-for="data in filteredPrices" :key="'modal-' + data.id">
            <div class="modal fade" :id="'errorModal' + data.id" tabindex="-1" role="dialog"
              aria-labelledby="errorModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <!-- <i class="text-danger fa-solid fa-cloud-arrow-up fa-4x"></i> -->
                    <i class="text-danger fa-solid fa-file-excel fa-4x"></i>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <h5 class="modal-title" id="errorModalLabel">Error en la Carga</h5>
                    <br>
                    <small>
                      {{ data.error }}, <strong class="text-danger">es necesario volverlo a cargar.</strong>
                    </small>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button @click="fetchPaymentFiles(1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="currentPage === 1">
              Primera
            </button>
            <button @click="fetchPaymentFiles(currentPage - 1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="currentPage === 1">
              Anterior
            </button>
            <button @click="fetchPaymentFiles(currentPage + 1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="!hasMorePages">
              Siguiente
            </button>
            <button @click="fetchPaymentFiles(lastPage)" class="btn btn-sm btn-outline-secondary"
              :disabled="currentPage === lastPage">
              Última
            </button>
          </div>
          <div class="mb-3">
            <span>Página {{ currentPage }} de {{ lastPage }}</span>
          </div>
        </div>
      </div>

      <!-- Rendiciones tab -->
      <div class="tab-pane fade" id="custom-tabs-one-targz" role="tabpanel" aria-labelledby="custom-tabs-one-targz-tab">
        <br>

        <button type="button" class="btn btn-success float-right mr-2" icon="fas fa-file" data-toggle="modal"
          data-target="#uploadTargzModal">
          <i class="fa-solid fa-upload"></i> Subir Archivos
        </button>

        <div class="modal fade" id="uploadTargzModal" tabindex="-1" aria-labelledby="uploadTargzModalLabel"
          aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <form @submit.prevent="uploadFile('tar', 'targz')" class="text-center">

                <div class="modal-body">
                  <!-- Zona de carga (drop-zone) -->
                  <div class="drop-zone" @click="openFileDialog('tar')" @dragover.prevent @dragenter.prevent
                    @drop.prevent="handleDrop($event, 'xls')">
                    <br>
                    <i class="fa-regular fa-copy fa-6x"></i>
                    <br><br>
                    <small>
                      <p v-if="!fileName.tar">Arrastra y suelta el archivo aquí o haz clic para seleccionar uno</p>
                      <p v-if="fileName.tar">Archivo seleccionado: {{ fileName.tar }}</p>
                    </small>
                    <br>
                  </div>
                  <br>
                  <input type="file" class="d-none" id="tarFileInput" ref="tarFileInput"
                    @change="onFileChange($event, 'tar')" />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn text-white" style="background-color:#0078D4;">Subir Archivo</button>
                </div>
              </form>

            </div>
          </div>
        </div>

        <br><br>

        <div v-if="loading" class="text-center">Loading...</div>
        <div v-else>
          <table ref="table" class="table" style="width: 100%">
            <thead class="text-secondary">
              <tr>
                <th style="color: silver">Tipo</th>
                <th style="color: silver">Nombre</th>
                <th style="color: silver">Fecha</th>
                <th style="color: silver">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in filteredPrices" :key="data.id">
                <td>
                  <button v-if="data.type === 1" class="btn btn-sm" style="background-color: #b7dfb9; color: #4caf50;">
                    XLS
                  </button>
                  <button v-else-if="data.type === 2" class="btn btn-sm"
                    style="background-color: #b7dfb9; color: #4caf50;">
                    XLS
                  </button>
                  <button v-else class="btn btn-sm" style="background-color: #fdd199; color: #fb8c00;">
                    Tar.gz
                  </button>
                </td>
                <td>{{ data.filename }}</td>
                <td>{{ formatDate(data.created_at) }}</td> <!-- Formato de fecha -->
                <td>
                  <button v-if="data.status === 1" class="btn btn-sm" style="border: 1px solid">
                    <span class="text-secondary">⬤</span> Procesando
                  </button>
                  <button v-else-if="data.status === 2" class="btn btn-sm" style="border: 1px solid">
                    <span class="text-success">⬤</span> Subido
                  </button>
                  <button v-else-if="data.status === 3" class="btn btn-sm" style="border: 1px solid" data-toggle="modal"
                    :data-target="'#errorModal' + data.id">
                    <span class="text-danger">⬤</span> Error en la carga
                  </button>
                  <button v-else class="btn btn-outline-default btn-sm" style="border: 1px solid">
                    <span class="text-secondary">⬤</span> En cola
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Modal para mostrar el error -->
          <div v-for="data in filteredPrices" :key="'modal-' + data.id">
            <div class="modal fade" :id="'errorModal' + data.id" tabindex="-1" role="dialog"
              aria-labelledby="errorModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <!-- <i class="text-danger fa-solid fa-cloud-arrow-up fa-4x"></i> -->
                    <i class="text-danger fa-solid fa-file-excel fa-4x"></i>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <h5 class="modal-title" id="errorModalLabel">Error en la Carga</h5>
                    <br>
                    <small>
                      {{ data.error }}, <strong class="text-danger">es necesario volverlo a cargar.</strong>
                    </small>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button @click="fetchPaymentFiles(1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="currentPage === 1">
              Primera
            </button>
            <button @click="fetchPaymentFiles(currentPage - 1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="currentPage === 1">
              Anterior
            </button>
            <button @click="fetchPaymentFiles(currentPage + 1)" class="btn btn-sm btn-outline-secondary mr-2"
              :disabled="!hasMorePages">
              Siguiente
            </button>
            <button @click="fetchPaymentFiles(lastPage)" class="btn btn-sm btn-outline-secondary"
              :disabled="currentPage === lastPage">
              Última
            </button>
          </div>
          <div class="mb-3">
            <span>Página {{ currentPage }} de {{ lastPage }}</span>
          </div>
        </div>
        <!-- <div class="drop-zone" @click="openFileDialog('tar')" @dragover.prevent @dragenter.prevent
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
        </form> -->
      </div>
      <br>
    </div>
  </div>


  <br>
</template>

<script>
import Swal from 'sweetalert2';
import axios from "@/plugins/axios";
import moment from 'moment';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default {
  components: {
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
    this.fetchSafitFiles();
    this.fetchPaymentFiles();
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
      this.fetchSafitFiles(1); // Ejecuta la función fetchSafitFiles con la primera página cuando cambie el término de búsqueda
    },
    // searchTerm: {
    //   handler: "fetchSafitFiles",
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

    async fetchSafitFiles(page) {
      this.loading = true;
      console.log('Antes de la petición SAFIT');

      try {
        const response = await axios.get("api/v1/file-manager/files", {
          params: {
            page: page,
            perPage: this.perPage,
            search: this.searchTerm,
            type: 1,
            t: new Date().getTime(), // Timestamp para evitar cache
          },
          withCredentials: false,
        });
        if (response.data) {
          console.log("response.data: ", response.data);
          this.files = response.data.data;
          this.currentPage = response.data.current_page;
          this.lastPage = response.data.last_page;
        } else {
          console.error("Error al cargar los archivos");
        }
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchPaymentFiles(page) {
      this.loading = true;
      console.log('Antes de la petición Cobranzas');

      try {
        const response = await axios.get("api/v1/file-manager/files", {
          params: {
            page: page,
            perPage: this.perPage,
            search: this.searchTerm,
            type: 2,
            t: new Date().getTime(), // Timestamp para evitar cache
          },
          withCredentials: false,
        });
        if (response.data) {
          console.log("response.data: ", response.data);
          this.files = response.data.data;
          this.currentPage = response.data.current_page;
          this.lastPage = response.data.last_page;
        } else {
          console.error("Error al cargar los archivos");
        }
      } catch (error) {
        console.error("Error: ", error);
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
  background-color: #0066ff;
}

.drop-zone {
  margin-top: 2rem;
  margin-left: 3rem;
  margin-right: 3rem;
  background-color: #e7f4ff;
  color: #6c757d;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  border: 3px dashed #378fdb;
  /* Línea punteada */

}

.drop-zone p {
  margin: 0;
  color: #6c757d;
}

.drop-zone input {
  display: none;
}
</style>