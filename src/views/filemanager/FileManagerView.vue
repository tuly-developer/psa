<script>
import Swal from "sweetalert2";
import { Toast } from "../../utils/sweetalert2/toast";
import axios from "@/plugins/axios";
import moment from "moment";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Components
// import UploadIcon from "../../assets/UploadIcon.vue";
import ClooudErrorIcon from "../../assets/CloudErrorIcon.vue";

export default {
  components: {
    // UploadIcon,
    ClooudErrorIcon,
  },

  data() {
    return {
      showSideBar: true,

      sectionSelected: "Safit",
      tableSections: ["Safit", "Cobranzas", "Tar.gz"],

      fileTypes: {
        Safit: "xls",
        Cobranzas: "xls",
        "Tar.gz": "tar.gz",
      },

      currentFileSelected: null,

      showFilterOptionsByDateAndStatus: false,
      loading: false,
      error: null,

      tableData: [],

      page: 1,
      perPage: 10,
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

  beforeMount() {
    window.document.title = `Dashboard | File Manager`;
  },

  methods: {
    toggleSideBar() {
      this.showSideBar = !this.showSideBar;
      if (this.showSideBar) {
        document.body.classList.remove("sidebar-collapse");
      } else {
        document.body.classList.add("sidebar-collapse");
      }
    },

    onFileChange(event) {
      const file = event.target.files[0];
      this.validateFile(file);
    },

    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      this.validateFile(file);
    },

    validateFile(file) {
      if (file) {
        const fileName = file.name;
        const fileExtension = file.name.split(".").pop().toLowerCase();

        let isValid = false;

        if (this.sectionSelected == "Safit") {
          isValid = fileExtension == "xls";
        } else if (this.sectionSelected == "Cobranzas") {
          isValid = fileExtension == "xls";
        } else if (this.sectionSelected == "Tar.gz") {
          isValid = fileExtension == "gz";
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
          this.sectionSelected == "Safit"
            ? "/v1/file-manager/safit"
            : this.sectionSelected == "Cobranzas"
              ? "/v1/file-manager/payment/upload"
              : "/v1/file-manager/targz/upload";

        if (this.sectionSelected == "Safit") {
          path = "/v1/file-manager/safit";
        } else if (this.sectionSelected == "Cobranzas") {
          path = "/v1/file-manager/payment/upload";
        } else if (this.sectionSelected == "Tar.gz") {
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

        if (res.status == 200 || res.status == 201 || res.status == 204) {
          Swal.fire({
            icon: "success",
            title: "Archivo subido",
            text: res.data.message,
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              window.location.reload();
            }
          });
        }
      } catch (err) {
        this.cancelUploadFile();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.response?.data?.error || "Error al subir el archivo.",
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
              this.sectionSelected == "Safit"
                ? 1
                : this.sectionSelected == "Cobranzas"
                  ? 2
                  : 3,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            status: this.status,
            t: new Date().getTime(),
          },
        });

        if (res.status == 200) {
          this.tableData = res.data.data;
          this.totalItems = res.data.total;
          this.lastPage = res.data.last_page;
        }
      } catch (err) {
        Toast.fire({
          icon: "error",
          title: "Ocurrio un error inesperado.",
          timer: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    changeTableSection(section) {
      this.sectionSelected = section;
      this.page = 1;
      this.dateFrom = "";
      this.dateTo = "";
      this.status = "";

      this.fetchData();

      this.currentFileSelected = null;
      this.$refs.fileInput.value = "";
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

    viewFilterOptionsByDateAndStatus() {
      this.showFilterOptionsByDateAndStatus =
        !this.showFilterOptionsByDateAndStatus;
    },

    changeDateFrom(event) {
      if (this.dateTo) {
        console.log("Aqui estoy");
        const dateFrom = new Date(event.target.value);
        const dateTo = new Date(this.dateTo);

        if (dateFrom > dateTo) {
          Swal.fire({
            icon: "info",
            title: "Advertencia",
            text: "La fecha de inicio 'Desde' debe ser menor a la fecha de fin 'Hasta'.",
          });

          this.dateFrom = "";
          this.$refs.dateFromInput.value = "";
          return;
        }
      }

      this.dateFrom = event.target.value;
    },

    changeDateTo(event) {
      if (this.dateFrom) {
        const dateFrom = new Date(this.dateFrom);
        const dateTo = new Date(event.target.value);

        if (dateTo < dateFrom) {
          Swal.fire({
            icon: "info",
            title: "Advertencia",
            text: "La fecha de fin 'Hasta' debe ser mayor a la fecha de inicio 'Desde'.",
          });

          this.dateTo = "";
          this.$refs.dateToInput.value = "";
          return;
        }
      }

      this.dateTo = event.target.value;
    },

    changeStatus(event) {
      this.status = parseInt(event.target.value);
    },

    applyFilterByDateAndStatus() {
      this.page = 1;
      this.showFilterOptionsByDateAndStatus = false;
      this.fetchData();
    },

    cleanFilters() {
      this.dateFrom = "";
      this.dateTo = "";
      this.status = "";
      this.showFilterOptionsByDateAndStatus = false;

      this.fetchData();
    },

    formatDate(dateString) {
      return moment(dateString).format("DD/MM/YYYY HH:mm");
    },

    formatTime(dateString) {
      return moment(dateString).format("HH:mm");
    },

    markErrorCircle(event) {
      const button = event.currentTarget;
      const span = button.querySelector(".circule-loading-error");
      if (span) {
        span.style.color = "white";
      }
    },

    uncheckTheErrorCircle(event) {
      const button = event.currentTarget;
      const span = button.querySelector(".circule-loading-error");
      if (span) {
        span.style.color = "#dc3545";
      }
    },
  },
};
</script>

<template>
  <main>
    <h1 class="filemanager-title">
      <span v-if="showSideBar" @click="toggleSideBar" class="filemanager-icon-button mdi mdi-arrow-left"></span>

      <span v-else @click="toggleSideBar" class="filemanager-icon-button mdi mdi-arrow-right"></span>
      Gestión de Archivos
    </h1>

    <section class="my-5 mx-3">
      <!-- Navbar -->
      <nav class="custom-nav ml-1">
        <a v-for="(item, index) of tableSections" @click="changeTableSection(item)" v-bind:key="index"
          class="nav-text-link" :style="item == sectionSelected && 'border-bottom: 2px solid blue;'">
          {{ item }}
        </a>
      </nav>

      <!-- Table -->
      <aside class="table-container">
        <article class="filter-container">
          <div style="position: relative">
            <!-- Zona de filtros de fecha y status -->
            <aside v-show="showFilterOptionsByDateAndStatus" style="
                position: absolute;
                width: 300px;
                background-color: white;
                top: 25px;
                right: -80px;
                border-radius: 6px;
                box-shadow: 0px 0px 10px 0px #d3d3d3;
                z-index: 100;
              " class="py-4 px-4">
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                ">
                <h5>Filtros</h5>

                <span @click="viewFilterOptionsByDateAndStatus"
                  style="color: gray; font-size: 30px; cursor: pointer">&times;</span>
              </div>

              <!-- <label style="
                  margin-top: 20px;
                  font-size: 14px;
                  font-weight: 600;
                  margin-left: 2px;
                " for="dateFromInput">
                Desde
              </label> -->
              <div style="
                  display: flex;
                  justify-content: space-between;
                  padding: 12px 10px;
                  border-radius: 6px;
                  border: 1px solid #d3d3d3;
                  width: 100%;
                ">
                <h7 style="color: gray">Desde</h7>
                <input :value="dateFrom" @change="changeDateFrom($event)" type="date" id="dateFromInput"
                  name="birthdaytime" ref="dateFromInput" style="border: none; font-size: 14px; outline: none" />
              </div>
              <br>
              <!-- <label style="
                  margin-top: 20px;
                  font-size: 14px;
                  font-weight: 600;
                  margin-left: 2px;
                " for="dateToInput">
                Hasta
              </label> -->
              <div style="
                  display: flex;
                  justify-content: space-between;
                  padding: 12px 10px;
                  border-radius: 6px;
                  border: 1px solid #d3d3d3;
                  width: 100%;
                ">
                <h7 style="color: gray">Hasta</h7>
                <input :value="dateTo" @change="changeDateTo($event)" type="date" id="dateToInput" name="birthdaytime"
                  ref="dateToInput" style="border: none; font-size: 14px; outline: none" />
              </div>

              <select :value="`${status}`" style="
                  font-family: 'Roboto', sans-serif;
                  font-size: 13px;
                  font-weight: 400;
                  color: gray;
                  margin-top: 20px;
                  outline: none;
                  padding: 15px 10px;
                  border-radius: 6px;
                  border: 1px solid #d3d3d3;
                  width: 100%;
                " @change="changeStatus($event)">
                <option value="" disabled selected>Estado</option>
                <option value="1" label="Procesando">Procesando</option>
                <option value="2" label="Subidos">Subidos</option>
                <option value="3" label="Error en las cargas">
                  Error en las cargas
                </option>
                <option value="4" label="En cola">En cola</option>
              </select>

              <div style="display: flex; gap: 10px">
                <button v-show="dateFrom || dateTo || status" @click="cleanFilters" style="
                    width: 100%;
                    margin-top: 20px;
                    font-size: 13px;
                    padding: 4px 0px;
                    color: #dc3545;
                    border: 1px solid #dc3545;
                    background: transparent;
                    border-radius: 6px;
                  ">
                  Limpiar filtros
                </button>
                <button @click="applyFilterByDateAndStatus" style="
                    width: 100%;
                    margin-top: 20px;
                    font-size: 13px;
                    padding: 4px 0px;
                    color: white;
                    background: #0078D4;
                    border-radius: 6px;
                    border: none;
                  ">
                  Aplicar
                </button>
              </div>
            </aside>
          </div>

          <div @click="viewFilterOptionsByDateAndStatus" class="filter-button-by-date">
            <span style="font-size: 15px" class="mdi mdi-filter-variant"></span>
            <p>Filtros</p>
          </div>

          <button data-toggle="modal" data-target="#uploadModal" style="background-color: #4CAF50;">
            <!-- <UploadIcon width="16" height="16" fill="white"></UploadIcon> -->
            <span style="margin-right: 0.5rem" class="fa-solid fa-upload"></span>
            Subir Archivos
          </button>
        </article>

        <div v-if="loading" class="text-center">
          <br><br>
          <img src="/images/loading.gif" alt="" style="height: 2rem;">
        </div>

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
              <!-- <th style="color: silver; font-size: 14px; font-weight: 600">
                Hora
              </th> -->
              <th style="color: silver; font-size: 14px; font-weight: 600">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="data in tableData" :key="data.id">
              <td>
                <button class="btn btn-sm" :style="data.type == 1
                  ? 'background-color: #b7dfb9; color: #4caf50; font-size: 14px; font-weight: 600; padding: 1px 13px;'
                  : data.type == 2
                    ? 'background-color: #b7dfb9; color: #4caf50; font-size: 14px; font-weight: 600; padding: 1px 13px;'
                    : 'background-color: #ffe5cc; color: orange; font-size: 14px; font-weight: 600; padding: 1px 13px;'
                  ">
                  {{
                    data.type == 1
                      ? "XLS"
                      : data.type == 2
                        ? "XLS"
                        : "Tar.gz"
                  }}
                </button>
              </td>

              <td style="font-size: 14px">{{ data.filename }}</td>

              <td style="font-size: 14px">
                {{ formatDate(data.created_at) }}
              </td>

              <!-- <td style="font-size: 14px">{{ formatTime(data.created_at) }}</td> -->

              <td>
                <button :class="`${data.status == 3 && 'text-loading-error'
                  } btn btn-sm`" :style="data.status == 3
                    ? 'font-size: 13px;border: 1px solid gray;font-weight: 600; cursor: pointer'
                    : 'font-size: 13px;border: 1px solid gray;font-weight: 600; cursor: default'
                    " @mouseover="markErrorCircle" @mouseout="uncheckTheErrorCircle"
                  :data-toggle="data.status == 3 && 'modal'" :data-target="data.status == 3 && '#errorModal' + data.id">
                  <span style="font-size: 11px" :class="data.status == 1
                    ? 'text-info'
                    : data.status == 2
                      ? 'text-success'
                      : data.status == 3
                        ? 'circule-loading-error'
                        : 'text-secondary'
                    ">⬤</span>
                  {{
                    data.status == 1
                      ? "Procesando..."
                      : data.status == 2
                        ? "Subido"
                        : data.status == 3
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
              Rows per page:<select @change="changePerPage($event)" style="
                  font-size: 12px;
                  outline: none;
                  width: 40px;
                  margin-left: 15px;
                  border-top: none;
                  border-left: none;
                  border-right: none;
                  border-bottom: 1px solid gray;
                ">
                <option>5</option>
                <option selected>10</option>
                <option>15</option>
                <option>20</option>
              </select>
            </p>

            <p style="font-size: 12px; font-weight: 500">
              {{ formattedPaginationInfo }}
              <span @click="backPage" :style="'margin-left: 12px; font-size: 18px;' +
                (page == 1
                  ? 'opacity:0.8; color: gray; cursor: default'
                  : 'opacity: 1; color: #1a1a32; cursor: pointer')
                " class="mdi mdi-chevron-left"></span>
              <span @click="nextPage" :style="'margin-left: 12px; font-size: 18px;' +
                (page == lastPage
                  ? 'opacity:0.8; color: gray'
                  : 'opacity: 1; color: #1a1a32; cursor: pointer')
                " class="mdi mdi-chevron-right"></span>
            </p>

            <div style="display: flex; gap: 35px; background-color: green"></div>
          </section>
        </article>
      </aside>

      <!-- Modals -->
      <aside>
        <!-- Zona de carga (drop-zone) -->
        <article class="modal fade" id="uploadModal">
          <form class="modal-dialog modal-content py-4 px-4" @submit.prevent="uploadFile">
            <label class="drop-zone" for="fileInput" @dragover.prevent @dragenter.prevent
              @drop.prevent="handleDrop($event)">
              <!-- <span style="font-size: 80px" class="mdi mdi-file-document"></span> -->
              <br>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">
                <rect width="72" height="72" fill="url(#pattern0_4065_7886)" />
                <defs>
                  <pattern id="pattern0_4065_7886" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_4065_7886" transform="scale(0.00390625)" />
                  </pattern>
                  <image id="image0_4065_7886" width="256" height="256"
                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAESZJREFUeNrsndF12zgWhmkfFaBUsEwFUSowU0Hs53mIXcHGFTipwNkK4nmYZ0kVhKogSgXhVBB1kAXiq11GIwkgCYAA8X3n8Cg5okUJwP3x4wIEL4pMefxreate3qmjKiAldupYqePP+z9uaopjGBcZBn6pXpbqWFD9yfNJicA9xYAAdAn+r+qYU/WT4UmJwB3F0I/LzH7vkuCfHLdK2D9TDDgAmzE/DQUnAJk6gHdUN04A8hWAiupGBCDDIYBqFHrc/4PqZjgACMBRVIO5oDmMWkc/TUGte3hEgCFAZ1RD2FHVydfhnYgAwwEEABABRAABAEQAEUAAABFABBAAQAQQAQQAEAFEAAEARAARQAAAEUAEEABABBABBAAQAUQAAQBEABFAAAARyF0EEABABDIWAQQAEIGMRQABAEQgYxFAAAARyFgEEABABDIWAQQAEIGMRQABAEQgYxFAAAARyFgEEABABDIWAQQAEIGMRQABAEQgYxFAAAARyFgEEACAjEUAAQDIWAQQAICMRQABAMhYBCYvAPrBoOqoaNaACPyT2dSCXb0s1KED/pX8u6Q5Q18RUG3qV3B3EIEipacSzxIO9lKCm2AHRGDKAiDBvpDjSl7nNE9ABCYmAAQ7IAKZCIAqoEXLuhPsgAhMVQBawb4fr1c0KUAEJigABDsgAmmIwMxBsFcHwb6giQAikIYIzCYc7LU6tur4Jq9fabaACFgKQMrBrgp4e+T30GIBETgnALKS7lEd10Wc2fidBPpGXptjwQ6ACHQUAEncfYko8A+DXffsDc0NEAHHAhBB8BPskKsI7NTf3Y/tAJYBg79pjddrCfYdzQcyFYH36vy1+rt6FAFQF9dftCTYAUYTgXcSH6M4gHeOPmsrAU+wAyLQTQR00v1uLAGoegZ7e9qtpsoBeovAaIn3GcEOENVwIDoB+I/6EU9U5XBktuWxSOveCF3392MP51TZ/aQFuedSxu3neEUxOWnAZfE81Vol9tVv5XvDRAXAtJKOm3vc8FCku9fBQmaLfMLQciQB+GY4p6KY3ARR4t+/9Pz5f9JExhEAo/LK2BXAG5Jn4r6OwMwsC31B5Qxmm7gLaAJc46Z4vm07u23hVCf7VTrjoKsCLyW7a6pcEoHD+Vg83/OQpHiFmAmS+z9eZ9rZ6M7hvTq+KDH4oY6lOt5L8tjrEKAoSAQWgRr3myK9ZNeTfO9g5aQOLQJ3Rb6JQe2A9OpAPWX8XYmAPh7Vce36QhdiPz4Uz1nqcxVzkbjF+jnl3wdpt7+OrIrnO2frofth7BcC1SYB0IlANt8AiIJrOXRcNvvcgQjCro8ANBbnlgWJQIDY0HF5K4cWhLYYGOP1sjU+NSkHeQCA+Kkkd/BVkomfzy3iaj8e3KQWV5QtQFLMxRl8FjF4f04ANjgAgNHYBhADPZPwua8DmPuekwTIFZn6fFE8T38+Ff7WjNzKrN8vZh0VSLuAhuoC8CICOwl+fdzJEnyd7X/r2IE/qM9+0rm/y9bFm4JEIEBMgqBXYH444g5cdMIPhw5g7wKqM39EIhBgfHewv0GvEndQ9fjIX/sQHgrAxvBhOACASNyBdNif5IlebTEoLT5ifsoBnP0jnQjkoR0A0bmDlRz73af+XTzfXHQSLRyXHQUAFwAQvyDoDvpvG+G4PPKHJAIB0uet4f1fLv7yyBusCARImFZO4Bx1XwHAAQDETWVxzvqUAJg2CZ2LwgBAmvZ/kAPABQCk7QD+t2/APwTActOPijIGiHL8XxbmdQDr/T8uz9mDM7BJKECc2OwbWJsEgEQgQJqYZul2bZd/SgBMicCSRCBAkg5g1f5PXweACwCIb/xvY/83RgEgEQgwSftv7QB+SxScgEQgQFr2f3u4bfg5ASARCJCO/S+LDtN/NgJAIhAgHWyG5KsuAkAiECAdTMt/d8dye7NTZ+uTVQ9vozo1ZW9t0/YPfCwpjShodFNXbX2VgQM4GqeXpqSB4f1/0YY6Bf+S4I8KXRdLH0/dDdy2dPCbhuNrHwKwSKSAYviej8RbvE1k4vb/pAOYGf7oW2oCIGqov9crUfgqgu80p+eP3glM2f5vT+3jaRKArU3AqQ+vIwj2RUFSEvIbWpYW7f5kfJ4VAB3YFonARREoESg/9iG1YNeLL+Q57riAOGkm3PufHP/b5ABsXMCrQMGvf+jX4vlppyn29PfEGXXjAZu7/2qfAhAqGPVTTZNdeCRTTTcFz1aMree/SXwa0DSDcdadzywuMHoiUHr/5O2zNLQVcQeO4mJR9Jz+c+kA9gEKAHH1/kYHYBQAywy/bxeAbQb4J8aHf5ge43dpeaFRE4HyI+qOf7YVu/1RHW9oKzAx+z+36HiNw81Zh2BajJkHKJ4TaHpOsjrx/fSh8xXbY67FYjoTYGr2f+NKAEZPBMpGBm8k36CP3algB8iAK4uYceoATJYkyIpAuQZBDziAgfbfZQ5AU1InAEHG/zbTfxtnAiD2uzGcxh6BAGGoLM5x6gBsXAA34gCEYfD0Xx8BMCUCK+oFwLv9nxc9d/8ZKgC1xZfDBQCMb//XPgSATUIB4rf/fhwAiUCAJBxAffjwD1cOwMYF4AAA/I3/dXyVrux/HwEgEQgQ9/i/9ikAxg8nEQjgDdPy38bywb7ehgAMAwD8MWj3n8ECQCIQYLTxv5O7/4Y6gMJCAHAAAOHtv2YVQgA2CABAdPZ/22X6b4gAmPIAc9m/HwDc2H8dT6aYWvf5bB8CgAsACNv797L/vQRA7jLaIQAA0Yz/d12n/4Y4ABsXcEWdATij8tH7DxEAEoEAYcb/Ovid7P4T0gGQCARwg9O7/0IJAC4AIIz939ru/nOMWZ8/0hdUPfzOYE0WBc/BO7RzOpv7WLCBaizowLmP9eGg4qJNHWk95BqXA/6WRGD34F8S/FGh62Jpucw2xt5fsx5LAEgEdtQAioC6cTz+3w19FsdswN9aJQKHjE8cWqhRxUg2cqTnj9sJpOgA6qEX8CkAexfQBAyySq55Ja9z2jYkOmS0ab/rodfpPQSw7NkXAQvru4yxH0QIogl+y9uoYTxirBubvEQ9mgBYfoFXAYJfB/qXBHr7e+KMunE4/t+6GF4PFYAYNgm9TcHqy1TTDU4gup7/JrZpQOnUvE7/ucgBaEybhJb6x/S5T7kDyYzzpaGxNgJc2P+Niwv5dgDB8gAAE8K4hsaVaxkkAJa3IFaeC6umvUBmDsCZi7wMEIBeE4GyEOLJcNqONgUpYDn9t4lJAEZPBCoRuFMvdyJG++Nj8Zx0e6nef0HTggmN/505gJmDz4ghEahF4MnCCQCkPv5vXK6uDeEAgrgAgAnY//1q1iC9vxMBiCQRCDAFbOJkE5UACLXhfZ4WBGDG6+4/PgWAx4YD+HcAtetcmisB+NvwfinjGwA4Pv7XnWRpOG3t+rqhHAAuAGD4+L+OUgAsdyVBAAD6j/+bvg//COEAbFwAiUCAAeN/HxcNKQA4AID+rGMXgG8IAIA3kncA+8ccAUDH2PK1lN6ZAJAIBEjL/rt2ADYugEQgQHdWUxEAHABAN3Y+pv98CQCJQIBEev8xHACJQIBubJIRABKBAHk7ABsXQCIQwDKWfO+k5UMAGsP7JfUKYMXa9wV8CIApEUgOAMCOOkUBMH5pufcZAE6zs8ypJZcD0CAAACP3/pqZ6w/USQvVwzeGsX6WiUBVLnrP98eCPEgs6HZ6H9vDQUON/305ABsXsMg0+JcEf1ToulhK3WTpAHwJAInAIxpAvFE3th2oy4d/jCEARvXKKREoG6LS88ftBLLr/cccAmQ5DACIafzvTQBk9ZLJwmSTCLQsDxiPJrL2krwDsHEBuTmAe+KMurEg6IyETwEgEfi7quuKvcEJRNfz30Q2DbgJebGZx8/WNubh3Ak6Eehzs4NIRWBF3EEODoBEIEBHRxJq+s+7AEjiy3QrY0mdA4zT+/t2ADYu4Io6Bxhn/B9CAEw/iCEAwP9dc3YOYP7415JhAEDA1X8xCQAuAOCZ9eQEQDKaOwQAIE8HYOMCSAQC4/+R1sOEEAASgQCREoMDIBEIkLEA4AIApioAJAIB8nYANi6ARCDAhAWARCBAxgLQGN6fy755AJDhEAAXADBVAbBc5FBRHQDTdACa2vA+jw0HmLAAsEkoQMYCYNoktCQRCJCvA8AFAExVAEgEAuTtADS14X0SgQATFgASgQAZCwCJQAAcAC4AIDsBIBEIkLcD0NSG90kEAkxYABpTHoBqAZiuAJgSgeQAACYsAMY8wONfS/IAAFMUgPs/bmqL03ABABN1ADYugEQgQMYCgAMAmLAAkAgEwAGchkQgwEQFgEQgQBzMRrz21hDkQROBynH8pDkADiCeYQAOAGDCAhA6EVhT3QDpOADXicA/qW6AhASgcHhj0P0fN0+W1wRAAHyjAlI/MrwxnOY6EXhTmB9VDoAAROICnOYBlOhowXmNEwCIQwBMicDK9QW1CKhDi8BdQWIQMudizItLku+L4bTXlluJZYkqw1Kckj6u5DXWjVUbcV/f5HUrrizFcn+vX1Jvu7ORr2+7SSgCkHaw1xLsU8q/XJl+fwod16gCoBuEatS6oZRnTnuVabAvpFwI9ji5NryfxPByFsF32BoEYJFJsC9E7PRrFfHX3R6x8VnNrKj6urY4bYMA2PHNoKYVwR5HsFvexJUDVxbnrBAAO3SjejAFTYqJQEly7oO9JNizsf/JuKJYhgAmok8EHgT7IvKhS30Q7CRZ7eu5LMwrVNep/J7RBSDFRGBiwX6MUgRgR/A77/2Tsf+xOIC9CygNDmCMQJ+3xun7YC8n0Ij1b9Dz2O/Vb9w3WJ20qhGEweP/pEQ1FgEYPRE44WC37dWupRwaGSKsRRC4d6JbW1yl9GMuYvgSMq2yNJz20tWqsYMFNbEH+04c0ka+63Xg67fFIGt3YLly9U7uPMUBdBwCmNBB2gwM9tQW1DTHRE8E80rEwLdwVfter+UOtBitMnQHby0FEwfQI1B/GALzo2pwHyYc7L2mjuQ3V9I4q8C/dyvuYJWDO1Bl/bU4n4/ayo1mCECPwv1iGF9pC/qmdf6hhY852LcS8N6XyopN3YtByOTprvg9mdhMLPi10H43nPZJ/e57BKBfAeve/cHQwJ4KVs/1cQf74UJod/ArfzCFRUWqLG/Vy2fDaW9S+60xCYBNIpBgH1bGCxGCtyO4g7r4fzKxSVAAlsX5BKye/nuR2u+KSQBsLNaY1BLsfxcTWCor0577ZKJ2CWXg/Mev4YIqx1Ui5WXKUek8yA0CMKyQvxdxTMfVRWZLZcUdtPMHIdnnDlYxugMpm6+G05Ka/otVAGzGWQR7GHfQFoPQ7qA9XNhFUB4fCsMNa4XDdSrZCoAUtmmqZcg4dL+gJuntqEYanrXXHoQW6FEXIlm0Sb1e42WKdRujAOje58tAESDY/dZRyIVIx9xBsIVI0h5/GE5LbvovWgFoFbrecPHWslE0BHsU7kAPFya1EMlyWHqTSjIzCQE4aFy3xe93YO2KvPaeS00Q2rmD5Bciqd/z2dQRqWtdpFpfFzRZ8CzgbUFIbiHSVKf/EAAYQxCSWohkOf13rz7vEwIA0E0M2guRxlqmfHYhkuXDP16mnHNCACAmd9AeLoTk6EIkixvUkp3+QwAgdnfQFoMy4OWbliCY7k1JdvoPAYAU3cEYC5HOkez0HwIAKQvCWAuRDnmR+jQ0AgCpi0FZjLMQ6bcNahAAgDgEoZ078DnVmPT0HwIAubiDtiC4dAevp3DnKAIAOQmCq4VIyU//IQCQuxgMWYj0pATgDgEAmJY7aA8XzpH89B8CAHDeHbTFoDw45cVU7kJFAAC6uYN5ag//OMd/BRgA3g70WvcmIioAAAAASUVORK5CYII=" />
                </defs>
              </svg>
              <br><br>
              <small>
                <p>
                  Arrastre y suelte el archivo elegido para cargar sus archivos.
                  <br />
                  Todos los tipos de XLS, HTML, CSV.
                </p>

                <!-- <p v-show="currentFileSelected">
                  Archivo seleccionado:
                  <span style="font-weight: 600; text-decoration: underline">{{
                    currentFileSelected?.name
                  }}</span>
                </p> -->
              </small>
              <br />
            </label>

            <aside v-show="currentFileSelected" class="load-zone">
              <section class="file-data">
                <p>
                  <br>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.3333 2.66699H7.99992C7.29267 2.66699 6.6144 2.94794 6.1143 3.44804C5.6142 3.94814 5.33325 4.62641 5.33325 5.33366V26.667C5.33325 27.3742 5.6142 28.0525 6.1143 28.5526C6.6144 29.0527 7.29267 29.3337 7.99992 29.3337H23.9999C24.7072 29.3337 25.3854 29.0527 25.8855 28.5526C26.3856 28.0525 26.6666 27.3742 26.6666 26.667V12.0003M17.3333 2.66699L26.6666 12.0003M17.3333 2.66699L17.3333 12.0003H26.6666"
                      stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  {{ currentFileSelected?.name }}
                </p>
                <p @click="cancelUploadFile">Cancelar</p>
              </section>

              <section style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 25px;
                ">
                <div style="
                    background: blue;
                    width: 85%;
                    height: 3px;
                    border-radius: 10px;
                  "></div>
                <p style="color: #1a1a32; font-size: 14px; font-weight: 600">
                  100%
                </p>
              </section>
            </aside>

            <div class="upload-modal-button-container">
              <button type="button" data-dismiss="modal">Cancelar</button>
              <button type="submit" style="background-color: #0078D4;">Importar</button>
            </div>

            <!-- Input -->
            <input type="file" class="d-none" id="fileInput" ref="fileInput" @change="onFileChange($event)" />
          </form>
        </article>

        <!-- Modal para mostrar el error -->
        <article v-for="data in tableData" :key="'modal-' + data.id">
          <div class="modal fade" :id="'errorModal' + data.id">
            <div class="modal-dialog" role="document">
              <div style="padding: 20px 30px; border: 3px solid #ff7f7f" class="modal-content">
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  ">
                  <ClooudErrorIcon></ClooudErrorIcon>

                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span style="color: black; font-size: 35px" aria-hidden="true">&times;</span>
                  </button>
                </div>

                <h5 class="modal-title mt-3" id="errorModalLabel">
                  Error en la Carga
                </h5>
                <p style="font-size: 14px; margin-top: 15px">
                  {{ data.error }},
                  <strong class="text-danger">es necesario volverlo a cargar.</strong>
                </p>
              </div>
            </div>
          </div>
        </article>
      </aside>
    </section>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

main {
  margin-left: 0px !important;
}

.filemanager-title {
  font-size: 22px;
  background: white;
  padding: 40px 15px;
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
  background-color: white;
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

.table-container .text-loading-error {
  color: #1a1a32;
}

.table-container .text-loading-error:hover {
  color: white;
  background-color: #dc3545;
}

.table-container .circule-loading-error {
  color: #dc3545;
}

/* Modals */
.drop-zone {
  margin: 13px 0px;
  background-color: #e7f4ff;
  color: #6c757d;
  border-radius: 6px;
  padding: 0px;
  text-align: center;
  cursor: pointer;
  border: 2px dashed #378fdb;
  /* Línea punteada */
}

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
