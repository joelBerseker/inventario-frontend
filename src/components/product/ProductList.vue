<script>
import ProductDetail from "./ProductDetail.vue";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import ConectionProduct from "@/mixin/conections/ConectionProduct";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Product",
  inject: ["confirmDialogue", "showToast"],
  data() {
    return {
      itemSelected: {},
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
      loadingContentList: false,
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
  props: ["changeTopbar"],
  mixins: [UtilityFunctions, ConectionProduct],
  components: {
    ProductDetail,
    TableLite,
    SystemContent,
    paginate: Paginate,
    ListContent,
  },
  methods: {
    onAdd() {
      this.getProducts(1);
    },
    onEdit() {
      this.getProducts(this.page);
    },
    onDelete() {
      this.getProducts(1);
    },
    getItemSelectedByUrl() {
      if (this.$route.query.id != undefined) {
        this.getProductRegister(this.$route.query.id).then((response) => {
          if (response.success) {
            this.itemSelected = response.response.data;
            this.$refs.modal.changeMode(2);
            this.$refs.modal.openModal();
          }
        });
      }
    },
    buttonAdd() {
      this.itemSelected = {};
      this.$refs.modal.changeMode(1);
      this.$refs.modal.openModal();
    },
    buttonView(row) {
      this.itemSelected = row;
      this.$refs.modal.changeMode(2);
      this.$refs.modal.openModal();
    },
    async buttonDelete(row) {
      this.confirmDeleteProductRegister(row.id).then((response) => {
        if (response.success) {
          this.getProducts(1);
        }
      });
    },
    async getProducts(page) {
      this.loadingContentList = true;
      this.table.rows = [];
      this.getProductRegisters(page).then((response) => {
        if (response.success) {
          response.response.data.results.forEach((element) => {
            this.table.rows.push(element);
            this.table.totalRecordCount = this.table.rows.length;
            this.numPag = Math.ceil(response.response.data.count / 10);
          });
          this.page = page;
          this.loadingContentSystem = false;
          this.loadingContentList = false;
        }
      });
    },
    clickCallback(pageNum) {
      this.page = pageNum;
      if (this.search == "") {
        this.getProducts(pageNum);
      } else {
        this.filter = pageNum + "&search_query=" + this.search;
        this.getProducts(this.filter);
      }
    },
    filterTable() {
      this.page = 1;
      this.filter = this.page + "&search_query=" + this.search;
      this.getProducts(this.filter);
    },
  },
  async created() {
    this.page = 1;
    this.changeTopbar(this.topbar);
    this.getProducts(this.page);
  },
});
</script>
<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <ProductDetail
      ref="modal"
      :itemSelected="itemSelected"
      v-on:item:add="onAdd"
      v-on:item:edit="onEdit"
      v-on:item:delete="onDelete"
      v-on:mounted:mymodal="getItemSelectedByUrl"
    />
    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="buttonAdd" type="button" class="btn btn-primary btn-sm mb-3">
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
    <ListContent ref="tableContent" :loading="this.loadingContentList" :size="table.rows.length">
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
            <button v-on:click="buttonView(data.value)" type="button" class="btn btn-secondary btn-sm me-1">
              <i class="bi bi-journal"></i>
            </button>
            <button v-on:click="buttonDelete(data.value)" type="button" class="btn btn-danger btn-sm">
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
    </ListContent>
  </SystemContent>
</template>
<script></script>

<style scoped>
.button-space {
  margin-right: 0.25rem;
}
</style>
