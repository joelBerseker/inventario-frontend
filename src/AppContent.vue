<template>
  <div>
    <transition name="t-app-content" mode="out-in">
      <div v-if="loadingLocal" class="center flex-column">
        <div><Icon size="55px" :speed="true" :mode="6"></Icon></div>
        <div class="secondary-text">Cargando aplicación...</div>
      </div>
      <div v-else>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Icon from "@/components/my_other_components/Icon.vue";

export default defineComponent({
  name: "AppContent",
  data() {
    return {
      loadingLocal: true,
    };
  },
  components: {
    Icon,
  },
  props: ["loading"],
  watch: {
    loading: {
      immediate: true,
      deep: true,
      handler() {
        if (this.loading) {
          this.loadingLocal = this.loading;
        } else {
          setTimeout(() => {
            this.loadingLocal = this.loading;
          }, 300);
        }
      },
    },
  },
});
</script>
<style scoped>
.center {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.t-app-content-enter-active,
.t-app-content-enter {
  transition: all 0.25s ease;
}

.t-app-content-leave-active {
  transition: all 0.25s ease;
}

.t-app-content-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.t-app-content-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
