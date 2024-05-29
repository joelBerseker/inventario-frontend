<script>
import DetailOutput from "./DetailOutput.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import Paginate from "vuejs-paginate-next";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import SystemContent from "@/components/system/SystemContent.vue";
import ListContent from "@/components/my_other_components/ListContent.vue";
import ConectionOutput from "@/mixin/conections/ConectionOutput";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Output",
  inject: ["confirmDialogue", "showToast"],
  data() {
    return {
      search: "",
      table: {
        columns: [
          {
            label: "Codigo",
            field: "order_code",
            width: "1%",
          },
          {
            label: "Cliente",
            field: "client_name",
            width: "63%",
          },
          {
            label: "Tipo Pago",
            field: "payment_type",
            width: "10%",
            display: (row) => {
              return this.getPaymentType(row.payment_type);
            },
          },
          {
            label: "Compra",
            columnClasses: ["text-end"],
            headerClasses: ["text-end"],
            field: "total_price",
            width: "10%",
            display: (row) => {
              return this.priceCorrect(row.total_price);
            },
          },
          {
            label: "Fecha",
            field: "date",
            width: "15%",
            display: (row) => {
              return this.timeAgo(row.date);
            },
          },
          {
            label: "",
            field: "quick",
            width: "1%",
          },
        ],
        rows: [],
        totalRecordCount: 0,
      },
      numPag: 0,
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
      selectedInvoiceType: "boleta",
      invoiceOptions: [
        { value: "boleta", label: "Boleta" },
        { value: "factura", label: "Factura" },
        { value: "boletaA4", label: "Boleta A4" },
        // Puedes agregar más opciones aquí si es necesario
      ],
      loadingContentSystem: true,
      loadingContentList: false,
    };
  },
  mixins: [UtilityFunctions, ConectionOutput],
  components: {
    DetailOutput,
    paginate: Paginate,
    TableLite,
    SystemContent,
    ListContent,
  },
  props: ["changeTopbar"],
  methods: {
    async openInNewTab(data, invoiceType) {
      const urls = url + "orders/orders/" + invoiceType + "/" + data + "/";
      try {
        const response = await axios.get(urls, {
          responseType: "blob", // Indicamos que esperamos una respuesta de tipo blob (archivo binario)
        });

        // Crear una URL temporal para el blob recibido
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

        // Crear un enlace <a> para descargar el archivo
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", `file-${invoiceType}-${data}.pdf`);

        // Agregar el enlace al documento y hacer clic en él para iniciar la descarga
        document.body.appendChild(link);
        link.click();

        // Limpiar el objeto URL creado para el blob
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        // Aquí puedes manejar el error según sea necesario
      }
    },
    onAdd() {
      this.getOutputs(1);
    },
    onEdit() {
      this.getOutputs(this.page);
    },
    onDelete() {
      this.getOutputs(1);
    },
    getIdUrl() {
      if (this.$route.query.id != undefined) {
        this.$refs.modal.openViewId(this.$route.query.id);
      }
    },
    buttonAdd() {
      this.$refs.modal.openAdd();
    },
    buttonView(row) {
      this.$refs.modal.openView(row);
    },
    async buttonDelete(row) {
      this.confirmDeleteOutputRegister(row.id).then((response) => {
        if (response.success) {
          this.getOutputs(1);
        }
      });
    },
    async getOutputs(page) {
      this.loadingContentList = true;
      this.table.rows = [];
      this.getOutputRegisters(page).then((response) => {
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
  <SystemContent ref="content" :loading="loadingContentSystem">
    <DetailOutput
      ref="modal"
      v-on:item:add="onAdd"
      v-on:item:edit="onEdit"
      v-on:item:delete="onDelete"
      v-on:mounted:mymodal="getIdUrl"
    />
    <div class="row justify-content-md-end">
      <div class="col-6">
        <button
          v-on:click="buttonAdd"
          type="button"
          class="btn btn-primary btn-sm mb-3"
        >
          <i class="bi bi-plus-lg"></i> Agregar Salida
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
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label class="form-check-label" for="flexCheckDefault">
                Nombre
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label class="form-check-label" for="flexCheckDefault">
                Documento
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label class="form-check-label" for="flexCheckDefault">
                Telefono
              </label>
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
          <button
            class="btn btn-secondary"
            type="button"
            v-on:click="filterTable"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
    <ListContent
      ref="tableContent"
      :loading="this.loadingContentList"
      :size="table.rows.length"
    >
      <table-lite
        class="mb-3"
        :is-static-mode="false"
        :is-slot-mode="true"
        :is-hide-paging="true"
        :columns="table.columns"
        :rows="table.rows"
        :total="table.totalRecordCount"
        @row-clicked="buttonView"
      >
        <template v-slot:quick="data">
          <div class="d-flex">
            <button
              class="btn btn-secondary btn-sm me-1"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              v-on:click.stop
            >
              <i class="bi bi-list-ul"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <div
                  class="dropdown-item item-select"
                  v-on:click.stop="buttonView(data.value)"
                >
                  <i class="bi bi-journal-text"></i> Visualizar
                </div>
              </li>
              <li v-for="option in invoiceOptions" :key="option.value">
                <div
                  class="dropdown-item item-select"
                  v-on:click.stop="openInNewTab(data.value.id, option.value)"
                >
                  <i class="bi bi-file-pdf"></i> {{ option.label }}
                </div>
              </li>
            </ul>
            <button
              v-on:click.stop="buttonDelete(data.value)"
              type="button"
              class="btn btn-danger btn-sm"
            >
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
