<script>
import DetailProduct from "./DetailProduct.vue";
import SystemContent from "@/components/system/SystemContent.vue";
import TableContent from "@/components/my_other_components/TableContent.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Product",
  data() {
    return {
      item_selected: {},
      search: "",
      filter: "",
      table: {
        columns: [
          {
            label: "Codigo",
            field: "code",
            width: "3%",
          },
          {
            label: "Nombre",
            field: "name",
            width: "20%",
          },
          {
            label: "Descripción",
            field: "description",
            width: "20%",
          },

          {
            label: "Compra",
            columnClasses: ["text-end"],
            field: "cost",
            width: "7%",
            display: (row) => {
              return this.priceCorrect(row.cost);
            },
          },
          {
            label: "Venta",
            columnClasses: ["text-end"],
            field: "price",
            width: "7%",
            display: (row) => {
              return this.priceCorrect(row.price);
            },
          },
          {
            label: "Cantidad",
            columnClasses: ["text-end"],
            field: "stock",
            width: "1%",
          },
          {
            label: "Actualizado",
            field: "updated_at",
            width: "1%",
            display: (row) => {
              return this.timeAgo(row.updated_at);
            },
          },
          {
            label: " ",
            field: "quick",
            width: "1%",
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },
      numPag: 4,
      page: "1",
      loadingContentSystem: true,
      loadingContentTable: false,
      topbar: {
        title: "Productos",
        icon: "bi bi-box-seam",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Productos",
            link: "",
          },
        ],
      },
    };
  },
  props: ["changeTopbar", "showToast", "confirmDialogue"],
  mixins: [UtilityFunctions],
  components: {
    DetailProduct,
    TableLite,
    SystemContent,
    paginate: Paginate,
    TableContent,
  },
  methods: {
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
        title: "Eliminar Producto",
        message: "¿Estas seguro que quieres eliminar el producto?",
        okButton: "Eliminar",
      }).then((result) => {
        if (result) {
          var path = url + "products/products/" + row.id + "/";
          axios
            .delete(path)
            .then((response) => {
              this.showToast({
                title: "Operación exitosa",
                message: "El registro de elimino correctamente.",
                type: 1,
              });
              this.getProductsNew(this.page);
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
    async getProductsNew(numPag) {
      this.loadingContentTable = true;
      this.table.rows = [];
      var path = url + `products/products/?page=` + numPag;
      axios
        .get(path)
        .then((response) => {
          response.data.results.forEach((element) => {
            this.table.rows.push(element);
            this.numPag = Math.ceil(response.data.count / 10);
          });
          this.loadingContentSystem = false;
          this.loadingContentTable = false;
        })
        .catch(() => {
          this.showToast({
            title: "Ocurrió un error",
            message: "No se pudo obtener los registros, si continúa sucediendo contacte con su proveedor.",
            type: 2,
          });
        });
    },
    clickCallback(pageNum) {
      this.page = pageNum;
      if (this.search == "") {
        this.getProductsNew(pageNum);
      } else {
        this.filter = pageNum + "&search_query=" + this.search;
        this.getProductsNew(this.filter);
      }
    },
    filterTable() {
      this.page = 1;
      this.filter = this.page + "&search_query=" + this.search;
      this.getProductsNew(this.filter);
    },
  },
  async created() {
    this.page = 1;
    this.changeTopbar(this.topbar);
    this.getProductsNew(this.page);
  },
});
</script>
<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <DetailProduct
      ref="modal"
      :deleteItem="deleteItem"
      :showToast="showToast"
      :item_selected="item_selected"
      :getProductsNew="getProductsNew"
    />
    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="addMode" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-circle"></i> Agregar Producto
        </button>
        <button
          v-on:click="this.$router.push('/product/add-product-excel')"
          type="button"
          class="btn btn-primary btn-sm mb-3 ms-1"
        >
          <i class="bi bi-file-earmark-spreadsheet"></i>
          Agregar por Excel
        </button>
      </div>
      <div class="col">
        <div class="input-group input-group-sm">
          <input
            type="text"
            class="form-control input-search"
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
    <TableContent ref="tableContent" :loading="this.loadingContentTable" :size="table.rows.length">
      <table-lite
        :is-static-mode="false"
        :is-slot-mode="true"
        :is-hide-paging="true"
        :columns="table.columns"
        :rows="table.rows"
        :total="table.totalRecordCount"
        class="mb-3"
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
    </TableContent>
  </SystemContent>
</template>
<script></script>

<style scoped>
.button-space {
  margin-right: 0.25rem;
}
</style>
