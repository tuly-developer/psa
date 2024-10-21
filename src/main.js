import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import ContentHeader from './components/ContentHeader.vue';
import Content from './components/ContentVue.vue';

// Importar Axios configurado
import axios from './plugins/axios';

// Importar DataTables
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';

// Importar CSS de DataTables
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';

// Importar Bootstrap y Font Awesome
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Swal from 'sweetalert2';

import 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import moment from 'moment';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});
window.Swal = Swal;
window.Toast = Toast;

const app = createApp(App);

// Configurar Axios globalmente
app.config.globalProperties.$axios = axios;

// Configurar moment globalmente
app.config.globalProperties.$moment = moment;

app.component('content-header', ContentHeader)
  .component('content', Content)
  .use(store)
  .use(router)
  .mount('#app');
