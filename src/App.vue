<script>
import { defineComponent } from "vue";
import Icon from "@/components/my_components/Icon.vue";
export default defineComponent({
  name: "App",
  data() {
    return {
      loading: true,
    };
  },
  components: {
    Icon,
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
  created() {
    console.log("created app");
    if (!this.$store.getters.isActive || this.$store.getters.isActive == null) {
      this.logout();
    } else {
      var link = window.location.href;
      var linkSlice = link.substring(link.lastIndexOf("/"), link.length);
      if (linkSlice == "/login") {
        this.$router.push("/");
      } else {
        if (linkSlice == "/index.html") this.$router.push("/");
      }
    }
  },
});
</script>
<template>
  <div id="app">
    <RouterView v-slot="{ Component }">
      <transition name="t-app" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>
<style scoped>
#app {
  overflow-x: hidden;
}
.center {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.t-app-enter-active,
.t-app-enter {
  transition: all 0.25s ease;
}
.t-app-leave-active {
  transition: all 0.25s ease;
}
.t-app-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.t-app-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
