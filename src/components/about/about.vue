<script>
import SystemContent from "@/components/system/SystemContent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  props: ["changeTopbar"],
  components: {
    SystemContent,
  },
  data() {
    return {
      loadingContentSystem: false,
      topbar: {
        title: "Mas información",
        icon: "bi bi-info-circle",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Mas informacion",
            link: "",
          },
        ],
      },
    };
  },
  methods: {
    async copyTo() {
      try {
        await navigator.clipboard.writeText(
          "https://docs.google.com/spreadsheets/d/1shM2f3sb77z6Hm93w9DS7nfRkxQ9cxRTWAmNqDJ0y_c/edit#gid=0"
        );
        console.log("Texto copiado al portapapeles");
      } catch (err) {
        console.error("Error al copiar al portapapeles:", err);
      }
    },
  },
  async created() {
    this.changeTopbar(this.topbar);
  },
});
</script>
<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <div>
      <div class="brand-panel">
        <img src="/elegant-lady-wordmark.png" alt="Elegant Lady" class="brand-wordmark" />
        <p>Inventario y ventas para una tienda de moda</p>
      </div>
      <div class="img-container">
        <img src="@/assets/logo_gg.png" width="80" />
      </div>
      <div class="mt-3 text-center">Desarrollado por Gleaming Grove</div>
      <div class="mt-2 text-center">gleaming.grove@gmail.com</div>
    </div>
  </SystemContent>
</template>

<style scoped>
.brand-panel { max-width: 520px; margin: 1rem auto 2rem; padding: 1.25rem; text-align: center; background: #9f0022; border-radius: 1rem; color: #fff; }
.brand-wordmark { display: block; width: min(100%, 340px); margin: auto; }
.brand-panel p { color: #f7e4e9; }
.img-container {
  display: flex;
  justify-content: center;
}
</style>
