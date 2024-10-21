<template>
  <div>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="mb-0" style="font-size: 2rem">{{ computedTitle.label }}</h1>
        <div class="d-flex align-items-center mt-6 mt-md-0">
          <button @click="openModalImportar" class="btn btn-primary">Importar</button>
        </div>
      </div>

      <div class="mb-3">
        <input
          type="text"
          v-model="searchTerm"
          class="form-control"
          placeholder="Buscar..."
        />
      </div>
      <div class="mb-3">
        <span>Página {{ currentPage }} de {{ lastPage }}</span>
      </div>
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else>
        <table
          ref="table"
          class="table table-striped table-bordered"
          style="width: 100%"
        >
          <thead class="thead-dark">
            <tr>
              <th>Tipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Versión</th>
              <th>Moneda</th>
              <th>Okm</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="price in filteredPrices" :key="price.id">
              <td>{{ getTypeLabel(price.id_tipo) }}</td>
              <td>{{ price.marca }}</td>
              <td>{{ price.modelo }}</td>
              <td>{{ price.version }}</td>
              <td>{{ price.moneda }}</td>
              <td>{{ price["0km"] }}</td>
              <td class="text-center">
                <button
                  @click="verMas(price)"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="fas fa-eye"></i> Más
                </button>
                <!--    <button
                  @click="deleteItem(price)"
                  class="btn btn-sm btn-outline-danger ml-2"
                >
                  <i class="fas fa-trash"></i> Eliminar
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-end">
          <button
            @click="fetchPrices(1)"
            class="btn btn-sm btn-outline-secondary mr-2"
            :disabled="currentPage === 1"
          >
            Primera
          </button>
          <button
            @click="fetchPrices(currentPage - 1)"
            class="btn btn-sm btn-outline-secondary mr-2"
            :disabled="currentPage === 1"
          >
            Anterior
          </button>
          <button
            @click="fetchPrices(currentPage + 1)"
            class="btn btn-sm btn-outline-secondary mr-2"
            :disabled="!hasMorePages"
          >
            Siguiente
          </button>
          <button
            @click="fetchPrices(lastPage)"
            class="btn btn-sm btn-outline-secondary"
            :disabled="currentPage === lastPage"
          >
            Última
          </button>
        </div>
      </div>
    </div>

    <ModalFormPrecios
      @import-completed="fetchPrices"
      @export-completed="handleExportCompleted"
      ref="modalFormPrecios"
      :subMenu="computedTitle"
      @closeModal="closeModal"
    />

    <PrecioActualizar :price="selectedPrice" v-if="showUpdate" />

    <ModalDetails
      v-if="modalData"
      :modalData="modalData"
      @close="modalData = null"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import axios from "@/plugins/axios";
import ModalFormPrecios from "@/components/precios/ModalFormPrecios.vue";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PrecioActualizar from "@/components/precios/PrecioActualizar.vue";
import ModalDetails from "@/components/precios/ModalDetails.vue";
import { mapState } from 'vuex';

export default {
  name: "PreciosView",
  components: {
    ModalFormPrecios,
    PrecioActualizar,
    ModalDetails,
  },

  data() {
    return {
      modalData: null,
      selectedPrice: null,
      prices: [],
      loading: false,
      error: null,
      lastPage: 1,
      currentPage: 1,
      perPage: 15,
      hasMorePages: false,
      searchTerm: "",
      showUpdate: false,
      selectedType: null,
    };
  },
  created() { 
    this.updateType();
  },
  mounted() {
    this.fetchPrices();
  },

  computed: {
    ...mapState(['menuItemsPrecio']),
    computedTitle() {
      const selectedMenuItem = this.menuItemsPrecio.find(item => item.link === `/main/precios/${this.$route.params.subMenu}`);
      return selectedMenuItem;
    },

    filteredPrices() {
      if (!this.searchTerm) return this.prices;

      const lowerCaseSearch = this.searchTerm.toLowerCase();
      return this.prices.filter(
        (price) =>
          (price.id_tipo &&
            price.id_tipo.toString().toLowerCase().includes(lowerCaseSearch)) ||
          (price.marca &&
            price.marca.toLowerCase().includes(lowerCaseSearch)) ||
          (price.modelo &&
            price.modelo.toLowerCase().includes(lowerCaseSearch)) ||
          (price.version &&
            price.version.toLowerCase().includes(lowerCaseSearch)) ||
          (price.moneda && price.moneda.toLowerCase().includes(lowerCaseSearch))
      );
    },
  },
  watch: {
    '$route.params.subMenu': 'updateType',
    prices(newPrices) {
      console.log("Prices have been updated:", newPrices);
    },
    searchTerm: {
      handler: "fetchPrices",
      immediate: false,
    },
  },

  methods: {
    openModalImportar() {
      this.$refs.modalFormPrecios.showModal();
    },
    closeModal() {
      this.$refs.modalFormPrecios.hideModal();
    },

    editItem(price) {
      this.selectedPrice = price;
      this.showUpdate = true;
    },
    deleteItem(price) {
      if (confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
        this.prices = this.prices.filter((item) => item.id !== price.id);
      }
    },

    async handleExportCompleted() {
      await this.fetchPrices();
    },

    verMas(price) {
      this.modalData = price;
    },

    async fetchPrices(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get("/prices", {
          params: {
            page: page,
            per_page: this.perPage,
            search: this.searchTerm,
            type: this.selectedType ? this.selectedType.value : null,
          },
          withCredentials: false,
        });
        if (response.data) {
          this.prices = response.data.data;
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

    updateType() {
      this.selectedType = this.menuItemsPrecio.find(item => item.link === `/main/precios/${this.$route.params.subMenu}`);
      this.fetchPrices();
    },

    getTypeLabel(idTipo) {
      const store = useStore();
      const type = store.state.menuItemsPrecio.find((item) => item.value == idTipo);
      return type ? type.label : "Desconocido";
    },
  },
};
</script>

<style scoped>
.btn-icon {
  background: none;
  border: none;
  padding: 0;
}

.btn-icon i {
  color: inherit;
  font-size: 1.2rem;
}
</style>
