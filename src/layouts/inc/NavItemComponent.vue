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

<template>
  <li class="nav-item" :class="{ 'menu-open': isOpen }">
    <aside :class="$style['nav-link']" @click="toggleMenu">
      <i v-if="icon" :class="`nav-icon ${icon}`"></i>

      <div>
        <slot />
        <i v-if="hasSubMenu" class="right fas fa-angle-left"></i>
      </div>
    </aside>

    <ul v-if="hasSubMenu" class="nav nav-treeview" :style="{ display: isOpen ? 'block' : 'none' }">
      <li v-for="item in subMenu" :key="item.value" :class="`nav-item ${$style['submenu-item']}`" >
        <router-link class="nav-link" :to="item.link" @click="handleClick(item.value)">
          <i v-if="item.icon" class="nav-icon" :class="item.icon"></i>
          <p>{{ item.label }}</p>
        </router-link>
      </li>
    </ul>
  </li>
</template>



<style module>
.nav-link {
  display: flex;
  font-size: 16px;
  align-items: center;
  height: 35px;
  padding: 0px 2px;
  border-radius: 6px;
  margin: 0px 17px 25px 8px;
  color: #1a1a32 !important;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #E5F3FF;
}

.submenu-item {
  margin-left: 20px;
}
</style>
