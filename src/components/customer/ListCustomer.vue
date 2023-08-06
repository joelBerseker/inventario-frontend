<script>
import DetailCustomer from "./DetailCustomer.vue";
import Content from "@/components/home/Content.vue";
import TableContent from "@/components/home/TableContent.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";

const url = import.meta.env.VITE_APP_RUTA_API;
import { defineComponent } from "vue";
export default defineComponent({
  name: "Customer",

  data() {
    return {
      item_selected: {},
      search: "",
      numPag: 2,
      page: 1,
      table: {
        columns: [
          {
            label: "Nombre",
            field: "name",
            width: "15%",
          },
          {
            label: "Tipo",
            field: "documentType",
            width: "1%",
            display: (row) => {
              return this.documentType(row.documentType);
            },
          },
          {
            label: "Document",
            field: "document",
            width: "10%",
          },

          {
            label: "Telefono",
            field: "phone",
            width: "10%",
          },
          {
            label: "Dirección",
            field: "address",
            width: "10%",
          },
          {
            label: "Correo",
            field: "mail",
            width: "10%",
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
            sortable: false,
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },

      loading: true,
      loadingTable: false,
      topbar: {
        title: "Clientes",
        icon: "bi bi-people",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Clientes",
            link: "",
          },
        ],
      },
    };
  },
  mixins: [UtilityFunctions],
  components: {
    DetailCustomer,
    TableLite,
    TableContent,
    Content,
    paginate: Paginate,
  },
  props: ["changeTopbar", "showToast", "confirmDialogue"],
  async created() {
    //console.log(this.$store.getters.getUser);
    this.changeTopbar(this.topbar);
    if (this.$store.getters.isActive) {
      await this.getCustomers(1);
    }
  },
  methods: {
    filterTable() {},
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
        title: "Eliminar Producto",
        message: "¿Estas seguro que quieres eliminar el producto?",
        okButton: "Eliminar",
      }).then((result) => {
        if (result) {
          var path = url + "clients/clients/" + row.id + "/";
          axios
            .delete(path)
            .then((response) => {
              console.log(response);
              this.showToast({
                title: "Operación exitosa",
                message: "El registro de elimino correctamente.",
                type: 1,
              });
              this.getCustomers(1);
              this.$refs.modal.closeModal();
            })
            .catch((e) => {
              console.log(e);
              this.showToast({
                title: "Ocurrió un error",
                message: "No se pudo eliminar el registro, si continúa sucediendo contacte con su proveedor.",
                type: 2,
              });
            });
        }
      });
    },

    async getCustomers(numpg) {
      this.loadingTableContent(true);
      this.page = numpg;

      this.table.rows = [];
      var path = url + `clients/clients/?page=` + numpg;
      axios
        .get(path)
        .then((response) => {
          response.data.results.forEach((element) => {
            this.table.rows.push(element);
            this.table.totalRecordCount = this.table.rows.length;
            this.numPag = Math.ceil(response.data.count / 10);
          });
          this.loadingContent(false);
          this.loadingTableContent(false);
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
      this.getCustomers(pageNum);
    },
  },
});
</script>
<template>
  <Content ref="content" :loading="loading">
    <DetailCustomer
      ref="modal"
      :deleteItem="deleteItem"
      :showToast="showToast"
      :item_selected="item_selected"
      :getCustomers="getCustomers"
    />
    <div class="row justify-content-md-end">
      <div class="col-6">
        <button v-on:click="addMode" type="button" class="btn btn-primary btn-sm mb-3">
          <i class="bi bi-plus-circle"></i> Agregar Cliente
        </button>
      </div>
      <div class="col">
        <div class="input-group input-group-sm">
          <div class="dropdown">
            <button
              class="btn btn-sm btn-secondary margin-dropdown"
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
          </div>
          <input type="text" class="form-control form-control-sm" id="name" name="name" v-model="search" required />
          <button class="btn btn-sm btn-secondary" type="button" @click="filterTable">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>

    <TableContent ref="tableContent" :loading="this.loadingTable" :size="table.rows.length">
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
        v-if="numPag>1"
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
  </Content>
</template>

<style scoped></style>
