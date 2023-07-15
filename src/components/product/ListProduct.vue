<script>
import DetailProduct from "./DetailProduct.vue";
import Content from '@/components/home/Content.vue'
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
      Products: [],
      breadcrumb: [
        {
          name: "Inicio",
          link: "/home"
        },
        {
          name: "Productos",
          link: ""
        },

      ],
      table: {
        isLoading: false,
        columns: [
          {
            label: "Codigo",
            field: "code",
            width: "5%",
            sortable: true,
          },
          {
            label: "Nombre",
            field: "name",
            width: "10%",
            sortable: true,
          },
          {
            label: "Descripción",
            field: "description",
            width: "20%",
            sortable: true,
          },

          {
            label: "Compra",
            columnClasses: ["text-end"],
            field: "cost",
            width: "10%",
            sortable: true,
            display: (row) => {
              return this.priceCorrect(row.cost);
            },
          },
          {
            label: "Venta",
            columnClasses: ["text-end"],
            field: "price",
            width: "10%",
            sortable: true,
            display: (row) => {
              return this.priceCorrect(row.price);
            },
          },
          {
            label: "Cantidad",
            columnClasses: ["text-end"],
            field: "stock",
            width: "10%",
            sortable: true,
          },
          {
            label: "Actualizado",
            field: "updated_at",
            width: "10%",
            display: (row) => {
              return this.timeAgo(row.updated_at);
            },
          },
          {
            label: " ",
            field: "quick",
            width: "0%",
            sortable: false,
          },
        ],
        rows: [],
        totalRecordCount: 0,
        sortable: {
          order: "name",
          sort: "asc",
        },
        messages: {
          pagingInfo: "Mostrando {0} - {1} de {2}",
          pageSizeChangeLabel: "Filas: ",
          gotoPageLabel: " Pagina: ",
          noDataAvailable: "No se encontraron elementos",
        },
      },
      numPag: 4,
      loading: true,
    };

  },
  props: ["changeTitle", "showToast", "confirmDialogue"],
  mixins: [UtilityFunctions],
  components: {
    DetailProduct,
    TableLite, Content,
    paginate: Paginate,
  },
  methods: {
    changeLoading(_loading) {
            setTimeout(() => { this.loading = _loading }, 300);
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
        title: "Eliminar Producto",
        message: "¿Estas seguro que quieres eliminar el producto?",
        okButton: "Eliminar",
      }).then((result) => {
        if (result) {
          var path = url + "products/products/" + row.id + "/";
          axios
            .delete(path)
            .then((response) => {
              console.log(response);
              this.showToast({
                title: "Eliminar Registro",
                message: "Operación exitosa",
                type: 1,
              });
              this.getProducts();
              this.$refs.modal.closeModal();
            })
            .catch(() => {
              this.showToast({
                title: "Eliminar Registro",
                message:
                  "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                type: 2,
              });
            });
        }
      });
    },
    async getProducts() {
      this.table.rows = [];
      var path = url + `products/products/`;
      axios
        .get(path)
        .then((response) => {
          response.data.results.forEach((element) => {
            this.table.rows.push(element);
          });
          this.table.totalRecordCount = response.data.count;
          this.numPag = Math.ceil(response.data.count / 10);

          this.changeLoading(false)
        })
        .catch(() => {
          this.showToast({
            title: "Obtener Registros",
            message:
              "Ocurrió un error, si continua sucediendo contacte con su proveedor",
            type: 2,
          });
        });
    },
    async getProductsNew(numPag) {
      this.table.rows = [];
      var path = url + `products/products/?page=` + numPag;
      axios
        .get(path)
        .then((response) => {
          response.data.results.forEach((element) => {
            this.table.rows.push(element);
          });
        })
        .catch(() => {
          this.showToast({
            title: "Obtener Registros",
            message:
              "Ocurrió un error, si continua sucediendo contacte con su proveedor",
            type: 2,
          });
        });
    },
    clickCallback(pageNum) {
      this.getProductsNew(pageNum);
    },
  },
  async created() {

    this.changeTitle({ name: "Productos", icon: "bi bi-box-seam", breadcrumb: this.breadcrumb });

    if (this.$store.getters.isActive) {
      await this.getProducts();

    }
  },
});
</script>
<template>
  <Content ref="mainContent" :loading="loading">
    <DetailProduct ref="modal" :deleteItem="deleteItem" :showToast="showToast" :item_selected="item_selected"
      :getProducts="getProducts" />


    <button v-on:click="addMode" type="button" class="btn btn-primary btn-sm mb-3">
      <i class="bi bi-plus-circle"></i> Agregar Producto
    </button>
    <table-lite :is-static-mode="false" :is-slot-mode="true" :is-hide-paging="true" :is-loading="table.isLoading"
      :columns="table.columns" :rows="table.rows" :total="table.totalRecordCount" :sortable="table.sortable"
      @is-finished="table.isLoading = false" :messages="table.messages" class="mb-3">
      <template v-slot:quick="data">
        <div>
          <button v-on:click="viewMode(data.value)" type="button" class="btn btn-secondary btn-sm">
            <i class="bi bi-journal"></i>
          </button>
        </div>
      </template>
    </table-lite>
    <paginate :page-count="numPag" :page-range="3" :margin-pages="2" :click-handler="clickCallback" :prev-text="'Anterior'"
      :next-text="'Siguiente'" :container-class="'pagination pagination-sm'" :page-class="'page-item'">
    </paginate>
  </Content>
</template>
<script></script>

<style scoped>
.button-space {
  margin-right: 0.25rem;
}
</style>
