<template>
  <div class="modal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Detalles de Precios</h5>
          <button type="button" class="close" @click="$emit('close')">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- Datos principales centrados y alineados -->
          <div class="main-data">
            <div v-for="(item, index) in mainData" :key="index" class="main-data-item">
              <strong>{{ item.key }}:</strong>
              <span>{{ item.value }}</span>
            </div>
          </div>
          <!-- Años en columnas alineados -->
          <div class="year-columns">
            <template v-for="(year, index) in yearData" :key="index">
              <div class="year-item">
                <strong>{{ year.key }}:</strong> {{ year.value }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close'],
  props: {
    modalData: Object
  },
  computed: {
    mainData() {
      const types = [
        { value: "1", label: "Autos" },
        { value: "2", label: "Motos" },
      ];

      return Object.entries(this.modalData)
        .filter(([key]) => !(/^\d{4}$/).test(key) && key !== 'id')
        .map(([key, value]) => {
          if (key === 'moneda' && value === '$') {
            value = 'Pesos';
          }
          if (key === 'id_tipo') {
            const type = types.find(type => type.value === value.toString());
            if (type) {
              value = type.label;
            }
            key = 'Tipo';
          }
          return { key, value };
        });
    },
    yearData() {
      return Object.entries(this.modalData)
        .filter(([key]) => (/^\d{4}$/).test(key))
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => parseInt(b.key) - parseInt(a.key)); 
    }
  }
};
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1050;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  position: relative;
  margin: 2rem auto;
  pointer-events: none;
}

.modal-lg {
  max-width: 70%;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff; 
  border: none;
  border-radius: 0.5rem;
  pointer-events: auto;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: #f8f9fa; 
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 2rem 1.5rem; 
  overflow: auto;
}

.main-data {
  display: grid;
  grid-template-columns: 1fr 1fr; 
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: #f0f0f0; 
  padding: 1rem; 
  border-radius: 0.25rem; 
}

.main-data-item {
  display: flex;
  align-items: flex-start; 
  margin-bottom: 0.5rem; 
}

.main-data-item strong {
  min-width: 6em; 
  display: inline-block;
  text-align: left;
  margin-right: 1em;
  color: #495057;
}

.year-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
  justify-content: center;
  padding: 0 2rem;
}

.year-item {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}

.year-item strong {
  font-weight: bold;
  display: inline-block;
  min-width: 6em;
  color: #495057;
}

@media (max-width: 768px) {
  .modal-dialog {
    max-width: 90%;
  }
}


.year-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.year-item strong {
  min-width: 6em;
  margin-right: 1em;
}
</style>
