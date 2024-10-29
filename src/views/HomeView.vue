<script>
export default {
  name: "HomeView",

  beforeMount () {
    document.title = `Dashboard | Home`;
  }
};
</script>

<template>
  <content-header />
  <content>
    <div class="row justify-content-center">
      <div class="col-6">
        <div class="card">
          <div class="card-body text-center">
            <img
              src="/images/logo.png"
              alt="Logo"
              class="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>
  </content>
</template>

<style scoped>
/* Estilos específicos para el componente HomeView */
</style>
