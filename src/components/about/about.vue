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
        await navigator.clipboard.writeText("https://docs.google.com/spreadsheets/d/1shM2f3sb77z6Hm93w9DS7nfRkxQ9cxRTWAmNqDJ0y_c/edit#gid=0");
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
    <a
      href="https://docs.google.com/spreadsheets/d/1shM2f3sb77z6Hm93w9DS7nfRkxQ9cxRTWAmNqDJ0y_c/edit#gid=0"
      >Drive</a
    >
    <button
      type="button"
      class="btn btn-sm btn-secondary profile-action-btn"
      @click="copyTo"
    >
      COPIAR
    </button>
  </SystemContent>
</template>

<style scoped></style>
