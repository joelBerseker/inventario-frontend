<script>
import SystemContent from "@/components/system/SystemContent.vue";
import {
  XlsxRead,
  XlsxJson,
  XlsxTable,
} from "vue3-xlsx/dist/vue3-xlsx.cjs.prod.js";
import { defineComponent } from "vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "templateContent",
  props: ["changeTopbar"],
  inject: ["confirmDialogue", "showToast"],
  components: {
    SystemContent,
    XlsxRead,
    XlsxJson,
    XlsxTable,
    TableLite,
  },
  mixins: [UtilityFunctions],
  data() {
    return {
      file: null,
      data_to_xls: [],
      loadingContentSystem: false,
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
      table: {
        isLoading: false,
        columns: [
          {
            label: "Codigo",
            field: "code",
            width: "3%",
            sortable: true,
          },
          {
            label: "Nombre",
            field: "name",
            width: "20%",
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
            width: "7%",
            sortable: true,
          },
          {
            label: "Venta",
            columnClasses: ["text-end"],
            field: "price",
            width: "7%",
            sortable: true,
          },
          {
            label: "Cantidad",
            columnClasses: ["text-end"],
            field: "stock",
            width: "1%",
            sortable: true,
          },
        ],
        rows: [],
        totalRecordCount: 0,

        messages: {
          pagingInfo: "Mostrando {0} - {1} de {2}",
          pageSizeChangeLabel: "Filas: ",
          gotoPageLabel: " Pagina: ",
          noDataAvailable: "No se encontraron elementos",
        },
      },
    };
  },
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    prueba(data) {
      if (data != null) {
        this.data_to_xls = data;
        this.table.rows = this.data_to_xls;
      }
    },
    onClick(event) {
      var json_arr = JSON.stringify(this.data_to_xls);
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
        .post(path, data, config)
        .then((response) => {
          this.showToast({
            title: "Operación exitosa",
            message: "Los registros se agregaron correctamente.",
            type: 1,
          });
        })
        .catch((e) => {
          console.log(e);
          this.showToast({
            title: "Ocurrió un error",
            message:
              "No se pudo agregar el registro, si continúa sucediendo contacte con su proveedor.",
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
  <SystemContent ref="content" :loading="loadingContentSystem">
    <div class="row">
      <div class="col-4">
        <p class="title-text mb-3">Indicaciones</p>
        <p>El archivo debe contener las siguientes filas:</p>
        <ul>
          <li>code</li>
          <li>name</li>
          <li>description</li>
          <li>cost</li>
          <li>price</li>
          <li>stock</li>
          <li>deleted</li>
        </ul>
      </div>
      <div class="col-8">
        <p class="title-text mb-3">Ejemplo</p>
        <div class="w-100">
          <img src="../../assets/excel_example.png" class="w-100" alt="" />
        </div>
      </div>
      <div class="col-12">
        <hr />
      </div>
      <div class="col-12">
        <p class="title-text mb-3">Datos en excel</p>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col">
            <input
              type="file"
              class="form-control form-control-sm mb-3"
              @change="onChange"
            />
          </div>
          <div class="col">
            <button @click="onClick" class="btn btn-sm btn-primary">
              <i class="bi bi-file-earmark-arrow-up"></i> Subir
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <table-lite
          :is-static-mode="false"
          :is-slot-mode="true"
          :is-hide-paging="true"
          :is-loading="table.isLoading"
          :columns="table.columns"
          :rows="table.rows"
          :total="table.totalRecordCount"
          :sortable="table.sortable"
          @is-finished="table.isLoading = false"
          :messages="table.messages"
          class="mb-3"
        >
          <template v-slot:quick="data">
            <div class="d-flex">
              <button
                v-on:click="viewMode(data.value)"
                type="button"
                class="btn btn-secondary btn-sm me-1"
              >
                <i class="bi bi-journal"></i>
              </button>
              <button
                v-on:click="deleteItem(data.value)"
                type="button"
                class="btn btn-danger btn-sm"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </template>
        </table-lite>
      </div>
    </div>

    <div>
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
  </SystemContent>
</template>

<style scoped></style>
