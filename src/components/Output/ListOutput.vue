<script>
import DetailOutput from "./DetailOutput.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import Content from "@/components/home/Content.vue";
import TableContent from "@/components/home/TableContent.vue";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Output",
  data() {
    return {
      item_selected: {},
      search: "",
      Outputs: [],
      table: {
        columns: [
          {
            label: "Codigo",
            field: "order_code",
            width: "5%",
          },
          {
            label: "Cliente",
            field: "client_name",
            width: "10%",
          },
          {
            label: "Descripción",
            field: "description",
            width: "20%",
          },
          {
            label: "Compra",
            columnClasses: ["text-end"],
            field: "total_price",
            width: "10%",
            display: (row) => {
              return this.priceCorrect(row.total_price);
            },
          },
          {
            label: "Fecha",
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
        title: "Salidas",
        icon: "bi bi-box-arrow-left",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Salidas",
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
    DetailOutput,
    paginate: Paginate,
    TableLite,
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
    openInNewTab(data) {
      var link = url + "orders/orders/boleta/" + data + "/";
      window.open(link, "_blank", "noreferrer");
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
          var path = url + "orders/orders/" + row.id + "/";
          axios
            .delete(path)
            .then((response) => {
              console.log(response);
              this.showToast({
                title: "Operación exitosa",
                message: "El registro de elimino correctamente.",
                type: 1,
              });
              this.getOutputs();
              this.$refs.modal.closeModal();
            })
            .catch(() => {
              this.showToast({
                title: "Ocurrió un error",
                message: "No se pudo eliminar el registro, si continúa sucediendo contacte con su proveedor.",
                type: 2,
              });
            });
        }
      });
    },
    async getOutputs(num) {
      this.table.rows = [];
      var path = url + `orders/orders/?page=`+num;
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
            title: "Ocurrió un error",
            message: "No se pudo obtener los registros, si continúa sucediendo contacte con su proveedor.",
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
    await this.getOutputs(1);
  },
});
</script>
<template>
  <Content ref="content" :loading="loading">
    <DetailOutput
      ref="modal"
      :deleteItem="deleteItem"
      :showToast="showToast"
      :item_selected="item_selected"
      :getOutputs="getOutputs"
    />

    <button v-on:click="addMode" type="button" class="btn btn-primary btn-sm mb-3">
      <i class="bi bi-plus-circle"></i> Agregar Salida
    </button>
    <table-lite
      :is-static-mode="true"
      :is-slot-mode="true"
      :columns="table.columns"
      :rows="table.rows"
      :total="table.totalRecordCount"
    >
      <template v-slot:quick="data">
        <div class="d-flex">
          <button role="link" class="btn btn-warning btn-sm me-1" @click="openInNewTab(data.value.id)">
            <i class="bi bi-receipt"></i> Boleta
          </button>
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
