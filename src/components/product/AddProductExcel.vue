<script>
import Content from "@/components/home/Content.vue";
import {
  XlsxRead,
  XlsxJson,
  XlsxTable,
} from "vue3-xlsx/dist/vue3-xlsx.cjs.prod.js";
import { defineComponent } from "vue";
import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "templateContent",
  props: ["changeTopbar", "showToast", "confirmDialogue"],
  components: {
    Content,
    XlsxRead,
    XlsxJson,
    XlsxTable,
  },
  data() {
    return {
      file: null,
      data_to_xls: [],
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
    },
    prueba(data) {
      this.data_to_xls = data;
    },
    onClick(event) {
      var json_arr = JSON.stringify(this.data_to_xls);
      console.log(json_arr);
      this.addItem(json_arr);
    },
    addItem(data) {
      const config = {
        headers: {
          "Content-Type": "application/json", // Indica que el cuerpo de la solicitud es un JSON
        },
      };
      var path = url + `products/products/`;
      axios
        .post(path, data,config)
        .then((response) => {
          this.showToast({
            title: "Registros Agregados",
            message: "Operación exitosa",
            type: 1,
          });
          this.getProducts();
          this.closeModal();
        })
        .catch(() => {
          this.showToast({
            title: "Agregar Registros",
            message:
              "Ocurrió un error, si continua sucediendo contacte con su proveedor",
            type: 2,
          });
        });
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
        <xlsx-json>
          <template #default="{ collection }">
            <div>
              {{ prueba(collection) }}
            </div>
          </template>
        </xlsx-json>
      </xlsx-read>
    </div>
    <button @click="onClick">Subir</button>
  </Content>
</template>

<style scoped></style>
