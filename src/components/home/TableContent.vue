<template>
  <div>
    <transition name="t-content" mode="out-in">
      <div :key="_loading">
        <div v-show="_loading">
          <div class="d-flex justify-content-center mt-3 align-items-center">
            <div class="spinner-border spinner-border-sm secondary-text"></div>
            <div class="secondary-text">&nbsp; Cargando...</div>
          </div>
        </div>

        <div v-show="!_loading">
          <div v-if="size <= 0">
            <div class="d-flex justify-content-center align-items-center">
              <div class="color-3"> No se encontraron registros, puede agregar uno nuevo con el boton de arriba a la izquierda.</div>
            </div>
          </div>
          <div v-else>
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Icon from "@/components/my_components/Icon.vue";

export default defineComponent({
  name: "TableContent",
  data() {
    return {
      _loading: true,
    };
  },
  props: ["loading", "listInfo", "size"],
  components: {
    Icon,
  },
  methods: {
    loadingTableContent(loading) {
      if (loading) {
        this._loading = loading;
      } else {
        setTimeout(() => {
          this._loading = loading;
        }, 200);
      }
    },
  },
  created() {
    this._loading = this.loading;
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
  transition: all 0.3s ease;
}

.t-content-leave-active {
  /*transition: all 0.25s ease;*/
}

.t-content-leave-to {
  transform: translateY(5px);
  opacity: 0;
}

.t-content-enter-from {
  transform: translateY(-5px);
  opacity: 0;
}
</style>
