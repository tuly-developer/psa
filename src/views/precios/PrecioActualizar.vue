<template>
  <div>
    <div class="form-group">
      <label for="marca">Marca</label>
      <input type="text" class="form-control" id="marca" disabled>
    </div>
    <div class="form-group">
      <label for="modelo">Modelo</label>
      <input type="text" class="form-control" id="modelo"  disabled>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    price: {
      type: Object,
      required: true 
    }
  },
    mounted() {
    console.log('Precio recibido:', this.price);
  }
};
</script>
<style scoped>

</style>
