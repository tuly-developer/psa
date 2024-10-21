<template>
  <li class="nav-item" :class="{ 'menu-open': isOpen }">
    <a class="nav-link" @click="toggleMenu">
      <i v-if="icon" :class="`nav-icon ${icon}`"></i>
      <p>
        <slot />
        <i v-if="hasSubMenu" class="right fas fa-angle-left"></i>
      </p>
    </a>
    <ul v-if="hasSubMenu" class="nav nav-treeview" :style="{ display: isOpen ? 'block' : 'none' }">
      <li v-for="item in subMenu" :key="item.value" class="nav-item submenu-item">
        <router-link class="nav-link" :to="item.link" @click="handleClick(item.value)">
          <i v-if="item.icon" class="nav-icon" :class="item.icon"></i>
          <p>{{ item.label }}</p>
        </router-link>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: null,
    },
    link: {
      type: [String, Object],
      default: null,
    },
    subMenu: {
      type: Array,
      default: () => [],
    },
  },
  
  computed: {
    isOpen() {
      return this.$store.state.menuOpenState[this.menuStateKey] || false;
    },
    menuStateKey() {
      return `${this.link}-open`;
    },
    hasSubMenu() {
      return this.subMenu.length > 0;
    },
  },

  mounted() { 
    this.$store.commit('setMenuOpenState', { isOpen: false, menuKey: this.menuStateKey });
  },


  methods: {
    toggleMenu() {
      if (this.hasSubMenu) {
        const newState = !this.isOpen;
        this.$store.commit('setMenuOpenState', { isOpen: newState, menuKey: this.menuStateKey });
      } else {
        this.$router.push(this.link);
      }
    },
    handleClick(value) {
      this.$store.commit('setPriceCategory', value);
    },
  },
};
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
.submenu-item {
  margin-left: 20px;
}
</style>
