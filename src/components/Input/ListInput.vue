<script>
import DetailInput from "./DetailInput.vue";
import Content from "@/components/home/Content.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
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
        isLoading: false,
        columns: [
          {
            label: "Codigo",
            field: "order_code",
            width: "5%",
            sortable: true,
          },
          {
            label: "Proveedor",
            field: "id_provider",
            width: "10%",
            sortable: true,
          },
          {
            label: "Descripción",
            field: "detail",
            width: "20%",
            sortable: true,
          },
          /**
                    {
                        label: "Compra",
                        field: "cost",
                        width: "10%",
                        sortable: true,
                        display: (row) => {
                            return this.priceCorrect(row.cost);
                        },
                    },
                    {
                        label: "Venta",
                        field: "price",
                        width: "10%",
                        sortable: true,
                        display: (row) => {
                            return this.priceCorrect(row.price);
                        },
                    },
                    {
                        label: "Cantidad",
                        field: "stock",
                        width: "10%",
                        sortable: true,
                    }, */
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
            topbar: {
                title: "Entradas",
                icon: "bi bi-box-arrow-left",
                breadcrumb: [
                    {
                        name: "Inicio",
                        link: "/home"
                    },
                    {
                        name: "Entradas",
                        link: ""
                    },

                ],
            },
            loading: false

        };
    },
    mixins: [UtilityFunctions],
    components: {
        DetailInput,
        TableLite,
        Content
    },
    props: [
        "changeTopbar", "showToast", "confirmDialogue", "loadingContent"
    ],
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
                title: "Eliminar Salida",
                message: "¿Estas seguro que quieres eliminar el producto?",
                okButton: "Eliminar",
            })
                .then((result) => {
                    if (result) {
                        var path = url + "products/products/" + row.id + "/";
                        axios.delete(path).then((response) => {
                            console.log(response);
                            this.showToast({
                                title: "Eliminar Registro",
                                message: "Operación exitosa",
                                type: 1,
                            });
                            this.getInputs();
                            this.$refs.modal.closeModal();
                        }).catch(() => {
                            this.showToast({
                                title: "Eliminar Registro",
                                message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                                type: 2,
                            });
                        });
                    }
                });
        },
        async getInputs() {
            this.table.rows = [];
            var path = url + `purchase/purchase/`;
            axios.get(path).then((response) => {
                console.log(response);
                response.data.results.forEach((element) => {
                    this.table.rows.push(element);
                    this.table.totalRecordCount = this.table.rows.length;
                });
            }).catch((e) => {
                console.log(e);
                this.showToast({
                    title: "Obtener Registros",
                    message: "Ocurrió un error, si continua sucediendo contacte con su proveedor x2",
                    type: 2,
                });
            });
        },
    },
    async created() {
        this.changeTopbar(this.topbar)
        await this.getInputs();
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

        <button v-on:click="addMode" type="button" class="btn btn-primary btn-sm mb-3">
            <i class="bi bi-plus-circle"></i> Agregar Entrada
        </button>
        <table-lite :is-static-mode="true" :is-slot-mode="true" :is-loading="table.isLoading" :columns="table.columns"
            :rows="table.rows" :total="table.totalRecordCount" :sortable="table.sortable"
            @is-finished="table.isLoading = false" :messages="table.messages">
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
    </Content>
</template>
<script></script>

<style scoped>
.button-space {
  margin-right: 0.25rem;
}
</style>
