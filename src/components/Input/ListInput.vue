<script>
import DetailInput from "./DetailInput.vue";
import Content from "@/components/home/Content.vue";
import TableContent from "@/components/home/TableContent.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Input",
  data() {
    return {
      item_selected: {},
      Inputs: [],
      table: {
        columns: [
          {
            label: "Codigo",
            field: "order_code",
            width: "5%",
          },
          {
            label: "Proveedor",
            field: "provider_name",
            width: "10%",
          },
          {
            label: "Descripción",
            field: "detail",
            width: "20%",
          },
          {
            label: "Actualizado",
            field: "date",
            width: "10%",
            display: (row) => {
              return this.timeAgo(row.date);
            },
          },
          {
            label: " ",
            field: "quick",
            width: "7%",
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },
      numPag: 4,
      page: 1,
      topbar: {
        title: "Entradas",
        icon: "bi bi-box-arrow-left",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Entradas",
            link: "",
          },
        ],
      },
      loading: true,
      loadingTable: false,
    };
  },
  mixins: [UtilityFunctions],
  components: {
    DetailInput,
    TableLite,
    paginate: Paginate,
    Content,
    TableContent,
  },
  props: ["changeTopbar", "showToast", "confirmDialogue"],
  methods: {
    loadingContent(loading) {
      this.$refs.content.loadingContent(loading);
    },
    loadingTableContent(loading) {
      try {
        this.$refs.tableContent.loadingTableContent(loading);
      } catch (error) {}
    },
    addMode() {
      this.item_selected = {};
      this.$refs.modal.changeMode(1);
      this.$refs.modal.openModal();
    },
    viewMode(row) {
      this.item_selected = row;
      this.$refs.modal.changeMode(2);
      this.$refs.modal.openModal();
    },
    async deleteItem(row) {
      this.confirmDialogue({
        title: "Eliminar Salida",
        message: "¿Estas seguro que quieres eliminar el producto?",
        okButton: "Eliminar",
      }).then((result) => {
        if (result) {
          var path = url + "purchase/purchase/" + row.id + "/";
          axios
            .delete(path)
            .then((response) => {
              console.log(response);
              this.showToast({
                title: "Eliminar Registro",
                message: "Operación exitosa",
                type: 1,
              });
              this.getInputs("1");
              //this.$refs.modal.closeModal();
            })
            .catch((e) => {
              console.log(e);
              this.showToast({
                title: "Eliminar Registro",
                message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                type: 2,
              });
            });
        }
      });
    },
    async getInputs(num) {
      this.table.rows = [];
      var path = url + `purchase/purchase/?page=` + num;
      axios
        .get(path)
        .then((response) => {
          response.data.results.forEach((element) => {
            this.table.rows.push(element);
          });
          this.table.totalRecordCount = response.data.count;
          this.numPag = Math.ceil(response.data.count / 10);
          this.loadingContent(false);
        })
        .catch((e) => {
          console.log(e);

          this.showToast({
            title: "Obtener Registros",
            message: "Ocurrió un error, si continua sucediendo contacte con su proveedor x2",
            type: 2,
          });
        });
    },
    clickCallback(pageNum) {
      this.page = pageNum;
      this.getOutputs(pageNum);
    },
  },
  async created() {
    this.changeTopbar(this.topbar);
    await this.getInputs(1);
  },
});
</script>
<template>
  <Content ref="content" :loading="loading">
    <DetailInput
      ref="modal"
      :deleteItem="deleteItem"
      :showToast="showToast"
      :item_selected="item_selected"
      :getInputs="getInputs"
    />

    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="addMode" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-circle"></i> Agregar Entrada
        </button>
      </div>
      <div class="col">
        <div class="input-group input-group-sm">
          <button
            class="btn dropdown-toggle btn-secondary margin-dropdown"
            type="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-sliders"></i>
            Filtro
          </button>
          <div class="dropdown-menu p-4 text-muted" style="max-width: 200px">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault"> Nombre </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault"> Documento </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault"> Telefono </label>
            </div>
          </div>

          <input
            type="text"
            class="form-control"
            id="name"
            name="name"
            v-model="search"
            placeholder="Buscar..."
            required
          />
          <button class="btn btn-secondary" type="button" v-on:click="filterTable">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
    <table-lite
      class="mb-3"
      :is-static-mode="false"
      :is-slot-mode="true"
      :is-hide-paging="true"
      :columns="table.columns"
      :rows="table.rows"
      :total="table.totalRecordCount"
    >
      <template v-slot:quick="data">
        <div class="d-flex">
          <button v-on:click="viewMode(data.value)" type="button" class="btn btn-secondary btn-sm me-1">
            <i class="bi bi-journal"></i>
          </button>
          <button v-on:click="deleteItem(data.value)" type="button" class="btn btn-danger btn-sm">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </template>
    </table-lite>
    <paginate
      v-if="numPag > 1"
      v-model="page"
      :page-count="numPag"
      :page-range="3"
      :margin-pages="2"
      :click-handler="clickCallback"
      :prev-text="'Anterior'"
      :next-text="'Siguiente'"
      :container-class="'pagination pagination-sm'"
      :page-class="'page-item'"
    >
    </paginate>
  </Content>
</template>
<script></script>

<style scoped>
.button-space {
  margin-right: 0.25rem;
}
</style>
