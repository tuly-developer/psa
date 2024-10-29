<script>
import NavItemComponent from "./NavItemComponent.vue";

export default {
  components: {
    NavItemComponent,
  },
  mounted() {
    // document.body.classList.add('sidebar-collapse');
    // document.body.classList.add('sidebar-closed');
  },

  beforeMount() {
    // if the user is already logged in, redirect to the main page
    if (!window.localStorage.getItem("token")) {
      this.$router.push("/login");
    }
    document.title = `Dashboard | Main`;
  },

  methods: {
    logout() {
      window.localStorage.removeItem("token");
      window.location.reload();
    },
  },
};
</script>

<template>
  <!-- sidebar-dark-primary -->
  <main class="main-sidebar">
    <aside class="d-flex flex-column align-items-center justify-content-center mt-3">
      <img src="/images/logo.png" :alt="$store.state.app.name" :class="$style['logo-image']" />
      <h2 :class="$style['dashboard-text']">Dashboard</h2>
    </aside>

    <nav class="mt-4">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
        <nav-item-component class="ml-1" icon="mdi mdi-home-outline" link="/">Inicio</nav-item-component>
        <nav-item-component class="ml-1" icon="mdi mdi-file-outline" link="/filemanager">Gestión de
          Archivos</nav-item-component>
        <!-- <nav-item-component class="ml-1" icon="mdi mdi-radar" link="/">Informes</nav-item-component> -->
        <!-- <nav-item-component class="ml-1" icon="fas fa-list" link="/">Listado de tramites</nav-item-component> -->
        <p @click="logout" style="text-align: center; cursor: pointer">
          Cerrar sesión
        </p>
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
  line-height: 0.8;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-top: -3px;
  max-height: 50px;
  width: auto;
}
</style>
