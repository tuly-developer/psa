import { createStore } from 'vuex';

export default createStore({
  state: {
    count: 0,
    app: {
      name: 'DASHBOARD',
    },
    // Inicializa el estado de cada menú como false
    menuOpenState: {

    },
    menuIndices: {
      type: 1,
      label: "Indice de Precios"
    },
    menuNovedades: {
      type: 2,
      label: "Novedades"
    },
    menuItemsPrecio: [
      {
        icon: 'fas fa-car',
        label: 'Autos',
        link: '/main/precios/autos',
        value: 1,
      },
      {
        icon: 'fas fa-truck',
        label: 'Camiones',
        link: '/main/precios/camiones',
        value: 3,
      },
      {
        icon: 'fas fa-tractor',
        label: 'Maquinaria Agricola',
        link: '/main/precios/maquinaria',
        value: 4,
      },
      {
        icon: 'fas fa-motorcycle',
        label: 'Motos',
        link: '/main/precios/motos',
        value: 2,
      }
    ],

    priceCategory: null,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    setPriceCategory(state, category) {
      state.priceCategory = category;
    },
    setMenuOpenState(state, { isOpen, menuKey }) {
      state.menuOpenState[menuKey] = isOpen;
    },
    setMenuIndicesType(state, type) {
      state.menuIndices.type = type;
    },
  },
  actions: {
    increment({ commit }) {
      commit('increment');
    },
    setPriceCategory({ commit }, category) {
      commit('setPriceCategory', category);
    },
    setMenuIndicesType({ commit }, type) {
      commit('setMenuIndicesType', type);
    },
  },
  modules: {},
});
