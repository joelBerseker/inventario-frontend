<script>
import Icon from "@/components/my_other_components/Icon.vue";
import { defineComponent } from "vue";
import AuthService from "@/services/AuthService";

export default defineComponent({
  name: "Sidebar",
  components: {
    Icon,
  },

  data() {
    return {
      showSidebar: true,
      list: [],
      openGroups: {
        gastos: false,
      },
      fullList: [
        {
          title: "Inicio",
          icon: "bi bi-house",
          url: "/home",
        },
        {
          title: "Entradas",
          icon: "bi bi-box-arrow-in-right",
          url: "/inputs",
        },
        {
          title: "Salidas",
          icon: "bi bi-box-arrow-left",
          url: "/outputs",
        },
        {
          title: "Productos",
          icon: "bi bi-box-seam",
          url: "/product",
        },
        {
          title: "Usuarios",
          icon: "bi bi-person",
          url: "/users",
        },
        {
          title: "Clientes",
          icon: "bi bi-people",
          url: "/customer",
        },
        {
          title: "Proveedores",
          icon: "bi bi-truck",
          url: "/supplier",
        },
        {
          title: "Categorias",
          icon: "bi bi-tag",
          url: "/category",
        },
        {
          title: "Gastos",
          icon: "bi bi-cash-coin",
          key: "gastos",
          children: [
            {
              title: "Gastos",
              icon: "bi bi-wallet2",
              url: "/expenses",
            },
            {
              title: "Categorías de gastos",
              icon: "bi bi-tags",
              url: "/expense-categories",
            },
            {
              title: "Dashboard financiero",
              icon: "bi bi-bar-chart-line",
              url: "/financial-dashboard",
            },
          ],
        },
        {
          title: "Mas información",
          icon: "bi bi-info-circle",
          url: "/about",
        },
        {
          title: "Mi perfil",
          icon: "bi bi-person-vcard",
          url: "/user",
        },
      ],
    };
  },

  created() {
    this.loadMenu();
    this.syncOpenGroupsWithRoute();
  },

  watch: {
    "$store.state.user": {
      handler() {
        this.loadMenu();
      },
      deep: true,
      immediate: true,
    },
    "$route.path": {
      handler() {
        this.syncOpenGroupsWithRoute();
      },
      immediate: true,
    },
  },

  methods: {
    getRole() {
      const user = AuthService.getCurrentUser?.() || this.$store.state.user;

      if (!user) return null;
      if (user.is_superuser || user.is_admin) return "admin";
      if (user.is_staff) return "seller";

      return "user";
    },

    loadMenu() {
      const role = this.getRole();

      if (!role) {
        this.list = [];
        return;
      }

      if (role === "admin") {
        this.list = this.fullList.filter((item) =>
          [
            "/home",
            "/inputs",
            "/outputs",
            "/product",
            "/users",
            "/customer",
            "/supplier",
            "/category",
            "/about",
            "/user",
            undefined,
          ].includes(item.url)
        );

        this.list = this.list.map((item) => {
          if (item.key === "gastos") {
            return {
              ...item,
              children: item.children.filter((child) =>
                ["/expenses", "/expense-categories", "/financial-dashboard"].includes(child.url)
              ),
            };
          }
          return item;
        });

        return;
      }

      if (role === "seller") {
        this.list = this.fullList.filter((item) =>
          ["/outputs", "/about", "/user"].includes(item.url)
        );
        return;
      }

      this.list = [];
    },

    toggleGroup(key) {
      this.openGroups[key] = !this.openGroups[key];
    },

    isGroupOpen(key) {
      return !!this.openGroups[key];
    },

    hasActiveChild(children = []) {
      return children.some((child) => child.url === this.$route.path);
    },

    syncOpenGroupsWithRoute() {
      const isFinancialRoute = [
        "/expenses",
        "/expense-categories",
        "/financial-dashboard",
      ].includes(this.$route.path);

      if (isFinancialRoute) {
        this.openGroups.gastos = true;
      }
    },

    closeSidebar() {
      const sidebar = document.getElementById("sidebar");
      const mainContent = document.getElementById("main-content");

      if (sidebar) sidebar.style.width = "63px";
      if (mainContent) mainContent.style.marginLeft = "63px";

      this.showSidebar = false;
    },

    openSidebar() {
      const sidebar = document.getElementById("sidebar");
      const mainContent = document.getElementById("main-content");

      if (sidebar) sidebar.style.width = "250px";
      if (mainContent) mainContent.style.marginLeft = "250px";

      setTimeout(() => {
        this.showSidebar = true;
      }, 200);
    },

    sidebarButton() {
      if (this.showSidebar) {
        this.closeSidebar();
      } else {
        this.openSidebar();
      }
    },
  },
});
</script>

<template>
  <div class="d-flex flex-column align-items-center h-100">
    <transition name="t-sidebar-item" mode="out-in">
      <div class="mt-3 mb-2 px-3 main-text" v-if="showSidebar">
        <div class="d-flex flex-column align-items-center">
          <Icon size="55px"></Icon>
        </div>

        <p class="title-text text-center">Gestion de inventarios</p>
      </div>
      <div v-else class="mt-3 mb-2 px-3 main-text">
        <div class="d-flex flex-column align-items-center">
          <Icon size="40px" class="mt-5"></Icon>
        </div>
      </div>
    </transition>

    <button @click="sidebarButton()" type="button" class="btn btn-primary-outline btn-sm btn-sidebar">
      <i class="bi bi-list"></i>
    </button>

    <div class="d-flex w-100 my-c1 px-3 my-0 py-0">
      <hr class="w-100 my-2" />
    </div>

    <div v-for="item in list" :key="item.title" class="my-1 px-2 d-flex flex-column w-100">
      <template v-if="item.children && item.children.length">
        <button
          type="button"
          class="w-100 item-menu m-0 item-menu-button"
          @click="toggleGroup(item.key)"
        >
          <div
            class="content-item-menu d-flex justify-content-between align-items-center"
            :class="{ 'group-active': hasActiveChild(item.children) }"
          >
            <div>
              <i :class="item.icon"></i>
              <transition name="t-sidebar-item" mode="out-in">
                <span v-show="showSidebar">&nbsp;{{ item.title }}</span>
              </transition>
            </div>

            <transition name="t-sidebar-item" mode="out-in">
              <i
                v-show="showSidebar"
                class="bi"
                :class="isGroupOpen(item.key) ? 'bi-chevron-up' : 'bi-chevron-down'"
              ></i>
            </transition>
          </div>
        </button>

        <transition name="t-submenu">
          <div
            v-show="isGroupOpen(item.key) && showSidebar"
            class="submenu-wrapper"
          >
            <div
              v-for="child in item.children"
              :key="child.title"
              class="submenu-item"
            >
              <RouterLink :to="child.url" class="w-100 item-menu submenu-link m-0">
                <div class="content-item-menu submenu-content">
                  <i :class="child.icon"></i>
                  <span>&nbsp;{{ child.title }}</span>
                </div>
              </RouterLink>
            </div>
          </div>
        </transition>
      </template>

      <template v-else>
        <RouterLink :to="item.url" class="w-100 item-menu m-0">
          <div class="content-item-menu">
            <i :class="item.icon"></i>
            <transition name="t-sidebar-item" mode="out-in">
              <span v-show="showSidebar">&nbsp;{{ item.title }}</span>
            </transition>
          </div>
        </RouterLink>
      </template>
    </div>

    <transition name="t-sidebar-item" mode="out-in">
      <div v-show="showSidebar" class="my-c1 footer-text">
        Desarrollado por Gleaming Glow Team
      </div>
    </transition>
  </div>
</template>

<style scoped>
.footer-text {
  font-size: 0.6rem;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 1rem;
  margin-right: 1rem;
}

.t-sidebar-item-enter-active,
.t-sidebar-item-enter {
  transition: all 0.4s ease;
}

.t-sidebar-item-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.t-sidebar-item-enter-from {
  opacity: 0;
}

.t-submenu-enter-active,
.t-submenu-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.t-submenu-enter-from,
.t-submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}

.t-submenu-enter-to,
.t-submenu-leave-from {
  opacity: 1;
  max-height: 300px;
  transform: translateY(0);
}

.item-menu {
  text-decoration-line: none;
  color: var(--my-c1);
  border-radius: var(--my-br) !important;
  margin: 0.25rem;
  transform: translateX(0px);
}

.item-menu-button {
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
}

.main-text {
  color: var(--my-c1);
  height: 88px;
}

.content-item-menu {
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: var(--my-br);
}

.content-item-menu:hover,
.router-link-exact-active .content-item-menu,
.group-active {
  background-color: var(--my-c3);
}

.submenu-wrapper {
  padding-left: 0.9rem;
  margin-top: 0.15rem;
}

.submenu-item {
  display: flex;
  width: 100%;
  margin: 0.2rem 0;
}

.submenu-link {
  width: 100%;
}

.submenu-content {
  padding-top: 0.35rem;
  padding-bottom: 0.35rem;
  padding-left: 1rem;
  font-size: 0.92rem;
}

.btn-sidebar {
  position: absolute;
  margin-top: 1rem;
  right: 1rem;
}
</style>