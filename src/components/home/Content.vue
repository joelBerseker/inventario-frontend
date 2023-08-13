<template>
  <div>
    <transition name="t-content" mode="out-in">
      <div :key="_loading">
        <div v-show="_loading" class="center flex-column">
          <div><Icon size="55px" :speed="true" :mode="6"></Icon></div>
          
          <div class="secondary-text">Cargando contenido...</div>
        </div>
        <div v-show="!_loading" :class="classContent">
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
  name: "Content",
  data() {
    return {
      _loading: true,
    };
  },
  props: ["loading"],
  props:{
    loading:{},
    classContent:{
      default:"p-3"
    }
  },
  components: {
    Icon,
  },
  methods: {
    loadingContent(loading) {
      if (loading) {
        this._loading = loading;
      } else {
        setTimeout(() => {
          this._loading = loading;
        }, 50);
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
