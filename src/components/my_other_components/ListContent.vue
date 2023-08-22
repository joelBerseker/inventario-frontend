<template>
  <div>
    <transition name="t-content" mode="out-in">
      <div v-if="loadingLocal">
        <div class="d-flex justify-content-center mt-3 align-items-center">
          <div class="spinner-border spinner-border-sm secondary-text"></div>
          <div class="secondary-text">&nbsp; Cargando...</div>
        </div>
      </div>

      <div v-else>
        <div v-if="size <= 0">
          <div class="d-flex justify-content-center align-items-center">
            <div class="secondary-text">
              No se encontraron registros, puede agregar uno nuevo con el boton de arriba a la izquierda.
            </div>
          </div>
        </div>
        <div v-else>
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Icon from "@/components/my_other_components/Icon.vue";

export default defineComponent({
  name: "ListContent",
  data() {
    return {
      loadingLocal: true,
    };
  },
  props: ["loading" , "size"],
  components: {
    Icon,
  },
  watch: {
    loading: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (!(oldValue == undefined && newValue == false)) {
          if (this.loading) {
            this.loadingLocal = this.loading;
          } else {
            setTimeout(() => {
              this.loadingLocal = this.loading;
            }, 300);
          }
        } else {
          this.loadingLocal = this.loading;
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
