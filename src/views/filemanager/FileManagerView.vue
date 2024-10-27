<script>
import Swal from "sweetalert2";
import axios from "@/plugins/axios";
import moment from "moment";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default {
  data() {
    return {
      sectionSelected: "Safit",
      tableSections: ["Safit", "Cobranzas", "Tar.gz"],

      fileTypes: {
        Safit: "xls",
        Cobranzas: "html",
        "Tar.gz": "tar",
      },

      currentFileSelected: null,

      loading: false,
      error: null,

      tableData: [],

      page: 1,
      perPage: 5,
      lastPage: 1,
      dateFrom: "",
      dateTo: "",
      status: "",

      totalItems: 0,
    };
  },

  mounted() {
    this.fetchData();
  },

  computed: {
    formattedPaginationInfo() {
      const startItem = (this.page - 1) * this.perPage + 1;
      const endItem = Math.min(this.page * this.perPage, this.totalItems);
      return `${startItem}-${endItem} of ${this.totalItems}`;
    },
  },

  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      this.validateFile(file);
    },

    validateFile(file) {
      if (file) {
        const fileName = file.name;
        const fileExtension = file.name.split(".").pop().toLowerCase();

        let isValid = false;

        if (this.sectionSelected === "Safit") {
          isValid = fileExtension === "xls";
        } else if (this.sectionSelected === "Cobranzas") {
          isValid = fileExtension === "html";
        } else if (this.sectionSelected === "Tar.gz") {
          isValid = file.name.endsWith(".tar.gz") === "tar";
        }

        if (isValid) {
          this.currentFileSelected = {
            file,
            name: fileName,
            extension: fileExtension,
          };
        } else {
          Swal.fire({
            icon: "error",
            title: "Archivo no válido",
            text: `Por favor, selecciona un archivo ${this.fileTypes[
              this.sectionSelected
            ].toUpperCase()} válido.`,
          });
        }
      }
    },

    async uploadFile() {
      if (!this.currentFileSelected) {
        Swal.fire({
          icon: "warning",
          title: "No hay archivo",
          text: `Por favor, selecciona un archivo ${this.fileTypes[
            this.sectionSelected
          ].toUpperCase()} primero.`,
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", this.currentFileSelected.file);
      formData.append("fileType", this.currentFileSelected.extension);

      try {
        let path =
          this.sectionSelected === "Safit"
            ? "/v1/file-manager/safit"
            : this.sectionSelected === "Cobranzas"
            ? "/v1/file-manager/payment/upload"
            : "/v1/file-manager/targz/upload";

        if (this.sectionSelected === "Safit") {
          path = "/v1/file-manager/safit";
        } else if (this.sectionSelected === "Cobranzas") {
          path = "/v1/file-manager/payment/upload";
        } else if (this.sectionSelected === "Tar.gz") {
          path = "/v1/file-manager/targz/upload";
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

        const res = await axios.post(path, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 200 || res.status === 201 || res.status === 204) {
          Swal.fire({
            icon: "success",
            title: "Archivo subido",
            text: "El archivo se ha subido correctamente.",
          });
          window.location.reload();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Error al subir el archivo.",
        });
      }
    },

    cancelUploadFile() {
      this.currentFileSelected = null;
      this.$refs.fileInput.value = "";
    },

    async fetchData() {
      this.loading = true;

      try {
        const res = await axios.get("/v1/file-manager/files", {
          params: {
            page: this.page,
            perPage: this.perPage,
            type:
              this.sectionSelected === "Safit"
                ? 1
                : this.sectionSelected === "Cobranzas"
                ? 2
                : 3,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            status: this.status,
            t: new Date().getTime(),
          },
        });

        if (res.status === 200) {
          this.tableData = res.data.data;
          this.totalItems = res.data.total;
          this.lastPage = res.data.last_page;
        }
      } catch (err) {
        alert("Ocurrio un error inesperado.");
      } finally {
        this.loading = false;
      }
    },

    changeTableSection(section) {
      {
        this.sectionSelected = section;
        this.page = 1;
        this.dateFrom = "";
        this.dateTo = "";
        this.status = "";

        this.fetchData();
      }
    },

    nextPage() {
      if (this.page < this.lastPage) {
        this.page++;
        this.fetchData();
      }
    },

    backPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchData();
      }
    },

    changePerPage(event) {
      this.perPage = parseInt(event.target.value);
      this.page = 1;
      this.fetchData();
    },

    changeDateFrom(event) {
      this.dateFrom = event.target.value;
    },

    changeDateTo(event) {
      this.dateTo = event.target.value;
    },

    changeStatus(event) {
      this.status = parseInt(event.target.value);
    },

    applyFilterByDateAndStatus() {
      this.page = 1;
      this.fetchData();
    },

    formatDate(dateString) {
      return moment(dateString).format("DD/MM/YYYY HH:mm");
    },

    formatTime(dateString) {
      return moment(dateString).format("HH:mm");
    },
  },
};
</script>

<template>
  <main>
    <h1 class="filemanager-title">
      <span class="filemanager-icon-button mdi mdi-arrow-left"></span>
      Gestión de Archivos
    </h1>

    <section class="ml-4 mt-5">
      <!-- Navbar -->
      <nav class="custom-nav ml-1">
        <a
          v-for="(item, index) of tableSections"
          @click="changeTableSection(item)"
          v-bind:key="index"
          class="nav-text-link"
          :style="item === sectionSelected && 'border-bottom: 2px solid blue;'"
        >
          {{ item }}
        </a>
      </nav>

      <!-- Table -->
      <aside class="table-container">
        <article class="filter-container">
          <div
            class="filter-button-by-date"
            data-toggle="modal"
            data-target="#filterModal"
          >
            <span style="font-size: 15px" class="mdi mdi-filter-variant"></span>
            <p>Filtros</p>
          </div>

          <button data-toggle="modal" data-target="#uploadModal">
            <span style="margin-right: 5px" class="fa-solid fa-upload"></span>
            Subir Archivos
          </button>
        </article>

        <div v-if="loading" class="text-center">Cargando...</div>

        <table v-else ref="table" class="table" style="width: 100%">
          <thead class="text-secondary">
            <tr>
              <th style="color: silver; font-size: 14px; font-weight: 600">
                Tipo
              </th>
              <th style="color: silver; font-size: 14px; font-weight: 600">
                Nombre
              </th>
              <th style="color: silver; font-size: 14px; font-weight: 600">
                Fecha
              </th>
              <th style="color: silver; font-size: 14px; font-weight: 600">
                Hora
              </th>
              <th style="color: silver; font-size: 14px; font-weight: 600">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="data in tableData" :key="data.id">
              <td>
                <button
                  class="btn btn-sm"
                  :style="
                    data.type === 1
                      ? 'background-color: #b7dfb9; color: #4caf50; font-size: 14px; font-weight: 600; padding: 1px 13px;'
                      : data.type === 2
                      ? 'background-color: #d0e7ff; color: blue; font-size: 14px; font-weight: 600; padding: 1px 13px;'
                      : 'background-color: #ffe5cc; color: orange; font-size: 14px; font-weight: 600; padding: 1px 13px;'
                  "
                >
                  {{
                    data.type === 1
                      ? "XLS"
                      : data.type === 2
                      ? "Html"
                      : "Tar.gz"
                  }}
                </button>
              </td>

              <td style="font-size: 14px">{{ data.filename }}</td>

              <td style="font-size: 14px">
                {{ formatDate(data.created_at) }}
              </td>

              <td style="font-size: 14px">{{ formatTime(data.created_at) }}</td>

              <td>
                <button
                  class="btn btn-sm"
                  style="
                    font-size: 13px;
                    border: 1px solid gray;
                    font-weight: 600;
                  "
                  :data-toggle="data.status === 3 && 'modal'"
                  :data-target="data.status === 3 && '#errorModal' + data.id"
                >
                  <span
                    style="font-size: 11px"
                    :class="
                      data.status === 1
                        ? 'text-secondary'
                        : data.status === 2
                        ? 'text-success'
                        : data.status === 3
                        ? 'text-danger'
                        : 'text-secondary'
                    "
                    >⬤</span
                  >
                  {{
                    data.status === 1
                      ? "Procesando"
                      : data.status === 2
                      ? "Subido"
                      : data.status === 3
                      ? "Error en la carga"
                      : "En cola"
                  }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <article style="display: flex; justify-content: end">
          <section style="display: flex; align-items: center; gap: 17px">
            <p style="font-size: 12px; font-weight: 500">
              Rows per page:<select
                @change="changePerPage($event)"
                style="
                  font-size: 12px;
                  outline: none;
                  width: 50px;
                  margin-left: 15px;
                "
              >
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
              </select>
            </p>

            <p style="font-size: 12px; font-weight: 500">
              {{ formattedPaginationInfo }}
              <span
                @click="backPage"
                style="cursor: pointer; margin-left: 12px; font-size: 16px"
                class="mdi mdi-chevron-left"
              ></span>
              <span
                @click="nextPage"
                style="cursor: pointer; margin-left: 25px; font-size: 16px"
                class="mdi mdi-chevron-right"
              ></span>
            </p>

            <div
              style="display: flex; gap: 35px; background-color: green"
            ></div>
          </section>
        </article>
      </aside>

      <!-- Modals -->
      <aside>
        <!-- Zona de carga (drop-zone) -->
        <article class="modal fade" id="uploadModal">
          <form
            class="modal-dialog modal-content py-4 px-4"
            @submit.prevent="uploadFile"
          >
            <label class="drop-zone" for="fileInput">
              <span
                style="font-size: 80px"
                class="mdi mdi-file-document"
              ></span>

              <small>
                <p v-show="!currentFileSelected">
                  Arrastre y suelte el archivo elegido para cargar sus archivos.
                  <br />
                  Todos los tipos de XlS, HTML, CSV.
                </p>

                <p v-show="currentFileSelected">
                  Archivo seleccionado:
                  <span style="font-weight: 600; text-decoration: underline">{{
                    currentFileSelected?.name
                  }}</span>
                </p>
              </small>
              <br />
            </label>

            <aside v-show="currentFileSelected" class="load-zone">
              <section class="file-data">
                <p>
                  <span
                    style="font-size: 20px"
                    class="mdi mdi-file-document"
                  ></span>
                  {{ currentFileSelected?.name }}
                </p>
                <p @click="cancelUploadFile">Cancelar</p>
              </section>

              <section
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 25px;
                "
              >
                <div
                  style="
                    background: blue;
                    width: 85%;
                    height: 3px;
                    border-radius: 10px;
                  "
                ></div>
                <p style="color: #1a1a32; font-size: 14px; font-weight: 600">
                  100%
                </p>
              </section>
            </aside>

            <div class="upload-modal-button-container">
              <button type="button" data-dismiss="modal">Cancelar</button>
              <button type="submit">Subir Archivo</button>
            </div>

            <!-- Input -->
            <input
              type="file"
              class="d-none"
              id="fileInput"
              ref="fileInput"
              @change="onFileChange($event)"
            />
          </form>
        </article>

        <!-- Modal para mostrar el error -->
        <article v-for="data in tableData" :key="'modal-' + data.id">
          <div class="modal fade" :id="'errorModal' + data.id">
            <div class="modal-dialog" role="document">
              <div
                style="padding: 20px 30px; border: 3px solid #ff7f7f"
                class="modal-content"
              >
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <i class="text-danger fa-solid fa-cloud-arrow-up fa-4x"></i>

                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span
                      style="color: black; font-size: 35px"
                      aria-hidden="true"
                      >&times;</span
                    >
                  </button>
                </div>

                <h5 class="modal-title mt-3" id="errorModalLabel">
                  Error en la Carga
                </h5>
                <p style="font-size: 14px; margin-top: 15px">
                  El archivo no coincide con los campos requeridos,
                  <strong class="text-danger"
                    >es necesario volverlo a cargar.</strong
                  >
                </p>
              </div>
            </div>
          </div>
        </article>

        <!-- Filter modal -->
        <article class="modal fade" id="filterModal">
          <div class="modal-dialog modal-content py-4 px-4">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <h3>Filtros</h3>

              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span style="color: black; font-size: 35px" aria-hidden="true"
                  >&times;</span
                >
              </button>
            </div>

            <div
              style="
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                padding: 12px 10px;
                border-radius: 6px;
                border: 1px solid #d3d3d3;
                width: 100%;
              "
            >
              <h6 style="color: gray">Fecha</h6>
              <input
                :value="dateFrom"
                @change="changeDateFrom($event)"
                type="datetime-local"
                id="dateFrom"
                name="birthdaytime"
                style="border: none; font-size: 14px; outline: none"
              />
            </div>

            <div
              style="
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                padding: 12px 10px;
                border-radius: 6px;
                border: 1px solid #d3d3d3;
                width: 100%;
              "
            >
              <h6 style="color: gray">Fecha</h6>
              <input
                :value="dateTo"
                @change="changeDateTo($event)"
                type="datetime-local"
                id="dateFrom"
                name="birthdaytime"
                style="border: none; font-size: 14px; outline: none"
              />
            </div>

            <select
              :value="`${status}`"
              style="
                font-size: 13px;
                margin-top: 20px;
                outline: none;
                padding: 15px 10px;
                border-radius: 6px;
                border: 1px solid #d3d3d3;
                width: 100%;
              "
              @change="changeStatus($event)"
            >
              <option value="" disabled selected>Estado</option>
              <option value="1" label="Procesando">Procesando</option>
              <option value="2" label="Subidos">Subidos</option>
              <option value="3" label="Error en las cargas">
                Error en las cargas
              </option>
              <option value="4" label="En cola">En cola</option>
            </select>

            <button
              @click="applyFilterByDateAndStatus"
              style="
                width: 100%;
                margin-top: 20px;
                font-size: 13px;
                padding: 4px 0px;
                color: white;
                background: blue;
                border-radius: 6px;
                border: none;
              "
            >
              Aplicar
            </button>
          </div>
        </article>
      </aside>
    </section>
  </main>
</template>

<style scoped>
main {
  margin-left: 0px !important;
}

.filemanager-title {
  font-size: 22px;
  background: white;
  padding: 40px 0px;
}

.filemanager-title .filemanager-icon-button {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
  margin-right: 5px;
  font-size: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.custom-nav {
  display: flex;
}

.nav-text-link {
  display: block;
  color: #1a1a32;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  width: 85px;
  padding: 2px 0px;
  cursor: pointer;
}

.table-container {
  padding-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.table-container .filter-container {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 20px;
  margin-right: 15px;
  padding: 22px 0px;
}

.table-container .filter-container .filter-button-by-date {
  display: flex;
  gap: 8px;
  cursor: pointer;
  height: 23px;
}

.table-container .filter-container .filter-button-by-date p {
  color: #1a1a32;
  font-size: 14px;
  font-weight: 600;
}

.table-container .filter-container button {
  color: white;
  background: green;
  font-size: 15px;
  padding: 4px 15px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  transition: background 0.3s;
}

.table-container .filter-container button:hover {
  background: rgb(1, 111, 1);
}

.table-container table tbody .circule {
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
}

/* Modals */
.load-zone {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 40px;
  padding: 12px 13px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
}

.load-zone .file-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 27px;
}

.load-zone .file-data p {
  color: #1a1a32;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.upload-modal-button-container {
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-top: 25px;
}

.upload-modal-button-container button[type="button"] {
  color: gray;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 13px;
  border: 1px solid gray;
  border-radius: 6px;
}

.upload-modal-button-container button[type="submit"] {
  color: white;
  background-color: rgb(62, 62, 220);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 13px;
  border: none;
  border-radius: 6px;
}
</style>
