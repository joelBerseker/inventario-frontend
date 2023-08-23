<script>
import axios from "axios";
import AuthService from "@/services/AuthService";
import SystemTopBar from "@/components/system/SystemTopBar.vue";
import SystemLoading from "@/components/system/SystemLoading.vue";
import SystemSideBar from "@/components/system/SystemSideBar.vue";
import AppContent from "@/AppContent.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "System",
  inject: ["confirmDialogue"],
  components: {
    SystemTopBar,
    SystemLoading,
    SystemSideBar,
    AppContent,
  },
  data() {
    return {
      loadingAppContent: true,
      topbar: {
        title: "",
        icon: "",
        breadcrumb: [],
      },
    };
  },
  methods: {
    changeTopbar(topbar) {
      this.topbar.title = topbar.title;
      this.topbar.icon = topbar.icon;
      this.topbar.breadcrumb = topbar.breadcrumb;
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    confirmLogout() {
      this.confirmDialogue({
        title: "Cerrar Sesión",
        message: "¿Esta seguro que desea cerrar sesión?",
        okButton: "Aceptar",
      }).then((result) => {
        if (result) {
          this.logout();
        }
      });
    },
  },
  computed: {
    darkMode: function () {
      var resp = "";
      if (this.$store.getters.getUser.dark_mode) {
        resp = " dark-mode ";
      }
      return resp;
    },
  },
  provide() {
    return {
      confirmLogout: this.confirmLogout,
    };
  },
  async created() {
    console.log("created System");
    AuthService.getUser();
    this.loadingAppContent = false;
  },
  async updated() {
    if (!this.$store.getters.isActive) {
      this.logout();
      return;
    }
    const tokenActual = {
      refresh: this.$store.getters.isLoggedIn2,
    };
    try {
      const obtainToken = await AuthService.refresh_token(tokenActual);
      const token = obtainToken.access;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (e) {
      console.log(e);
      axios.defaults.headers.common["Authorization"] = null;
      this.logout();
    }
  },
});
</script>
<template>
  <AppContent :loading="loadingAppContent">
    <div id="sidebar">
      <SystemSideBar></SystemSideBar>
    </div>
    <div id="main-content" :class="darkMode">
      <SystemTopBar :topbar="topbar"></SystemTopBar>
      <RouterView v-slot="{ Component }">
        <transition name="t-main-content" mode="out-in">
          <component
            :is="Component"
            :changeTopbar="changeTopbar"
          />
        </transition>
      </RouterView>
    </div>
    <SystemLoading ref="loadingSystem"></SystemLoading>
  </AppContent>
</template>
<style scoped>
.t-main-content-enter-active,
.t-main-content-enter {
  transition: all 0.3s ease;
}
.t-main-content-leave-active {
}
.t-main-content-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
.t-main-content-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}
#sidebar {
  overflow: hidden;
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  background-color: var(--my-2th-color);
  border-right: 1px solid rgba(255, 255, 255, 0.164);
  transition: width 0.3s;
}
#main-content {
  transition: margin-left 0.3s;
  margin-left: 250px;
  min-height: 100vh;
  background-size: cover;
  overflow-x: hidden;
}
</style>
