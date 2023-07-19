<script>
import Content from "@/components/home/Content.vue";
import { XlsxRead, XlsxTable } from 'vue3-xlsx/dist/vue3-xlsx.cjs.prod.js';
import { defineComponent } from "vue";

export default defineComponent({
  name: "templateContent",
  props: ["changeTopbar", "showToast", "confirmDialogue"],
  components: {
    Content,
    XlsxRead,
    XlsxTable
  },
  data() {
    return {
      file: null,
      loading: false,
      topbar: {
        title: "Agregar por Excel",
        icon: "icon",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Productos",
            link: "/product",
          },
          {
            name: "Agregar por Excel",
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
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;

      console.log(this.file);
    },
  },
  async created() {
    this.changeTopbar(this.topbar);
  },
});
</script>
<template>
  <Content ref="content" :loading="loading">
    <div>
      <h3>Import XLSX</h3>
      <input type="file" @change="onChange" />
      <xlsx-read :file="file">
        <xlsx-table />
      </xlsx-read>
  </div>
  </Content>
</template>

<style scoped></style>
