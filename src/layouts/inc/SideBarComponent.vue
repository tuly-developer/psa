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


<template>
  <!-- sidebar-dark-primary -->
  <main class="main-sidebar ">
    <aside class="d-flex flex-column align-items-center justify-content-center mt-3">
      <img src="@/assets/favicon/favicon.png" :alt="$store.state.app.name" :class="$style['logo-image']">
      <h2 :class="$style['dashboard-text']"> Dashboard </h2>
    </aside>

    <nav class="mt-4">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
        <nav-item-component class="ml-1" icon="mdi mdi-home-outline" link="/main">Inicio</nav-item-component>
        <nav-item-component class="ml-1" icon="mdi mdi-file-outline" link="/main/filemanager">Gestión de Archivos</nav-item-component>
        <nav-item-component class="ml-1" icon="mdi mdi-radar" link="/main">Informes</nav-item-component>
        <nav-item-component class="ml-1" icon="fas fa-list" link="/main">Listado de tramites</nav-item-component>
      </ul>
    </nav>
  </main>
</template>


<style module>
.logo-image {
  width: 90px;
}

.dashboard-text {
  font-size: 20px;
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
