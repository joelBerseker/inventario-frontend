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

      scannerBuffer: "",
      scannerTimer: null,
      scannerEnabled: true,
      scannerStartedAt: null,
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

    isIgnoredKey(event) {
      const ignoredKeys = [
        "Shift",
        "Control",
        "Alt",
        "Meta",
        "CapsLock",
        "Tab",
        "Escape",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ];
      return ignoredKeys.includes(event.key);
    },

    isTypingInField() {
      const active = document.activeElement;
      if (!active) return false;

      const tag = active.tagName?.toLowerCase();

      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        active.isContentEditable
      );
    },

    clearScannerBuffer() {
      this.scannerBuffer = "";
      this.scannerStartedAt = null;

      if (this.scannerTimer) {
        clearTimeout(this.scannerTimer);
        this.scannerTimer = null;
      }
    },

    processScannedCode(scanned) {
      const cleanCode = String(scanned || "").trim();
      if (!cleanCode) return;

      console.log("SCANNER GLOBAL:", cleanCode);

      const targetRoute = {
        name: "outputs",
        query: {
          scan: cleanCode,
          auto_sale: "1",
          t: Date.now().toString(),
        },
      };

      if (this.$route.name === "outputs") {
        this.$router.replace(targetRoute);
      } else {
        this.$router.push(targetRoute);
      }
    },

    handleGlobalScanner(event) {
      if (!this.scannerEnabled) return;
      if (this.$route.path === "/login") return;
      if (this.isIgnoredKey(event)) return;

      // Si el usuario está escribiendo en cualquier input/textarea/select,
      // NO bloquear ni capturar teclas
      if (this.isTypingInField()) {
        return;
      }

      if (!this.scannerStartedAt) {
        this.scannerStartedAt = Date.now();
      }

      if (event.key === "Enter") {
        const scanned = this.scannerBuffer.trim();
        const elapsed = Date.now() - (this.scannerStartedAt || Date.now());

        this.clearScannerBuffer();

        if (!scanned || scanned.length < 2) return;
        if (elapsed > 3000) return;

        this.processScannedCode(scanned);
        return;
      }

      if (event.key.length === 1) {
        this.scannerBuffer += event.key;
      }

      if (this.scannerTimer) {
        clearTimeout(this.scannerTimer);
      }

      this.scannerTimer = setTimeout(() => {
        this.clearScannerBuffer();
      }, 500);
    },
  },

  computed: {
    darkMode() {
      let resp = "";
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

    try {
      if (!this.$store.getters.isActive) {
        this.logout();
        return;
      }

      const token = this.$store.getters.isLoggedIn;
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await AuthService.getUser();
      this.loadingAppContent = false;
    } catch (error) {
      console.log("Error cargando usuario en System:", error);
      axios.defaults.headers.common["Authorization"] = null;
      this.logout();
    }
  },

  mounted() {
    window.addEventListener("keydown", this.handleGlobalScanner, true);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleGlobalScanner, true);
    this.clearScannerBuffer();
  },

  async updated() {
    if (!this.$store.getters.isActive) {
      this.logout();
      return;
    }

    const refresh = this.$store.getters.isLoggedIn2;
    if (!refresh) {
      this.logout();
      return;
    }

    try {
      const tokenActual = { refresh };
      const obtainToken = await AuthService.refresh_token(tokenActual);
      const token = obtainToken.access;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (e) {
      console.log("Error refrescando token:", e);
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
          <component :is="Component" :changeTopbar="changeTopbar" />
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

.t-main-content-leave-active {}

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
  background-color: var(--my-c2);
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