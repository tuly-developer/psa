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
          <ul>
            <li v-for="item in formattedModalData.slice(0, itemsUntil0km)" :key="item.key">
              <strong>{{ item.key }}:</strong> {{ item.value }}
            </li>
          </ul>
          <div class="grid-container">
            <div class="grid-item" v-for="(item, index) in formattedModalData.slice(itemsUntil0km)" :key="index">
              <strong>{{ item.key }}:</strong> {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modalData: Object
  },
  computed: {
    formattedModalData() {
      const types = [
        { value: "1", label: "Autos" },
        { value: "2", label: "Motos" },
      ];

      return Object.entries(this.modalData)
        .filter(([key]) => key !== 'id')
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
          if (key.startsWith('a') && !isNaN(key.substring(1))) {
            key = key.substring(1);
          } else if (isNaN(key)) {
            key = key.charAt(0).toUpperCase() + key.slice(1);
          }
          return { key, value };
        });
    },
    itemsUntil0km() {
      return this.formattedModalData.findIndex(item => item.key === '0km') + 1;
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
  margin: 1.75rem auto;
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
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  pointer-events: auto;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  overflow: auto;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem 0;
}

li + li {
  border-top: 1px solid #ddd;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.grid-item {
  padding: 0.5rem;
  border: none;
}

.grid-item:not(:last-child) {
  border-bottom: 1px solid #ddd;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }
}
</style>
