<script>
import { defineComponent } from "vue";
import Icon from "@/components/my_other_components/Icon.vue";
import ConfirmDialogue from "@/components/my_other_components/ConfirmDialogue.vue";
import MyToast from "@/components/my_components/MyToast.vue";
export default defineComponent({
  name: "App",
  data() {
    return {
      
    };
  },
  components: {
    Icon,
    ConfirmDialogue,
    MyToast,
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    showToast(opts = {}) {
      this.$refs.toast.show(opts);
    },
    async confirmDialogue(opts = {}) {
      var resp = false;
      await this.$refs.confirmDialogue
        .show({
          title: opts.title,
          message: opts.message,
          okButton: opts.okButton,
        })
        .then((result) => {
          resp = result;
        });
      return resp;
    },
  },
  provide() {
    return {
      confirmDialogue: this.confirmDialogue,
      showToast: this.showToast,
    };
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
    <MyToast ref="toast"></MyToast>
    <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
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
