<template>
  <div>
    <transition name="t-content" mode="out-in">
      <div :key="loadingLocal">
        <div v-show="loadingLocal" class="center flex-column">
          <div><Icon size="55px" :speed="true" :mode="6"></Icon></div>

          <div class="secondary-text">Cargando contenido...</div>
        </div>
        <div v-show="!loadingLocal" :class="classContent">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Icon from "@/components/my_components/Icon.vue";

export default defineComponent({
  name: "SystemContent",
  data() {
    return {
      loadingLocal: true,
    };
  },
  components: {
    Icon,
  },
  props:{
    loading:{},
    classContent:{
      default:"p-3"
    }
  },
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
          }, 50);
        }
      },
    },
  },
});
</script>
<style scoped>
.center {
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.t-content-enter-active,
.t-content-enter {
  transition: all 0.25s ease;
}

.t-content-leave-active {
  transition: all 0.25s ease;
}

.t-content-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.t-content-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
