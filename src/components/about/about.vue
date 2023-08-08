<script>
import Content from "@/components/home/Content.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  props: ["changeTopbar", "showToast", "confirmDialogue"],
  components: {
    Content,
  },
  data() {
    return {
      loading: false,
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
    loadingContent(loading) {
      this.$refs.content.loadingContent(loading);
    },
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
  <Content ref="content" :loading="loading">
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
  </Content>
</template>

<style scoped></style>
