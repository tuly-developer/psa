<template>
  <aside class="main-sidebar sidebar-dark-primary" style="background-color: #ffffff;">
    <br>
    <div class="d-flex justify-content-center">
      <img src="/img/logo.png" :alt="$store.state.app.name" style="opacity: 0.8" class="brand-image img-circle">
    </div>
    <div class="text-center">
      <a href="#" class="brand-link" style="border: #ffffff;">
        <span class="brand-text text-dark ">Dashboard</span>
      </a>
    </div>
    <div class="">
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
          <!-- <nav-item-component class="ml-1" icon="fas fa-home" link="/main">Inicio</nav-item-component> -->
          <nav-item-component class="ml-1" icon="fas fa-file" link="/main/filemanager">Gestión de
            Archivos</nav-item-component>
          <nav-item-component class="ml-1" icon="fas fa-chart-pie" link="/main">Informes</nav-item-component>
          <!-- <nav-item-component class="ml-1" icon="fas fa-list" link="/main">Listado de tramites</nav-item-component> -->
        </ul>
      </nav>
    </div>
  </aside>
</template>
<script>
import NavItemComponent from './NavItemComponent.vue'

export default {
  components: {
    NavItemComponent,
  },
  mounted() {
    // document.body.classList.add('sidebar-collapse');
    // document.body.classList.add('sidebar-closed');
  }
}
</script>

<style scoped>
.image {
  margin-left: .5rem;
  margin-bottom: 1rem;
}

.brand-image {
  float: left;
  line-height: .8;
  margin-left: .5rem;
  margin-right: .5rem;
  margin-top: -3px;
  max-height: 50px;
  width: auto;
}
</style>
