<script>
import DetailSupplier from "./DetailSupplier.vue";
import axios from "axios";
import TableLite from "vue3-table-lite";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";

const url = import.meta.env.VITE_APP_RUTA_API;
import { defineComponent } from "vue";
export default defineComponent({
    name: "Supplier",

    data() {
        return {
            item_selected: {},
            Products: [],
            table: {
                isLoading: false,
                columns: [
                    {
                        label: "Nombre",
                        field: "name",
                        width: "5%",
                        sortable: true,
                    },
                    {
                        label: "Tipo",
                        field: "documentType",
                        width: "10%",
                        sortable: true,
                    },
                    {
                        label: "Document",
                        field: "document",
                        width: "20%",
                        sortable: true,
                    },

                    {
                        label: "Telefono",
                        field: "phone",
                        width: "10%",
                        sortable: true,
                    },
                    {
                        label: "Dirección",
                        field: "address",
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
                        width: "10%",
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
        };
    },
    mixins: [UtilityFunctions],
    components: {
        DetailSupplier,
        TableLite,
    },
    props: [
        "changeTitle", "showToast", "confirmDialogue"
    ],
    async created() {
        this.changeTitle({ name: "Proveedores", icon: "bi bi-truck" })
        if (this.$store.getters.isActive) {
            await this.getSuppliers();
        }
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
            await this.confirmDialogue({
                title: "Eliminar Producto",
                message: "¿Estas seguro que quieres eliminar el producto?",
                okButton: "Eliminar",
            }).then((result) => {
                if (result) {
                    var path = url + "providers/providers/" + row.id + "/";
                    axios.delete(path).then((response) => {
                        console.log(response);
                        this.showToast({
                            title: "Eliminar Registro",
                            message: "Operación exitosa",
                            type: 1,
                        });
                        this.getSuppliers();
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
        async getSuppliers() {
            this.table.rows = [];
            var path = url + `providers/providers/`;
            axios.get(path).then((response) => {
                response.data.results.forEach((element) => {
                    this.table.rows.push(element);
                    this.table.totalRecordCount = this.table.rows.length;
                });
            }).catch(() => {
                this.showToast({
                    title: "Obtener Registros",
                    message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                    type: 2,
                });
            });
        },
    },
});
</script>
<template>
    <DetailSupplier ref="modal" :deleteItem="deleteItem" :showToast="showToast" :item_selected="item_selected"
        :getSuppliers="getSuppliers" />

    <button v-on:click="addMode" type="button" class="btn btn-primary btn-sm mb-3">
        <i class="bi bi-plus-circle"></i> Agregar Proveedor
    </button>
    <table-lite :is-static-mode="true" :is-slot-mode="true" :is-loading="table.isLoading" :columns="table.columns"
        :rows="table.rows" :total="table.totalRecordCount" :sortable="table.sortable" @is-finished="table.isLoading = false"
        :messages="table.messages">
        <template v-slot:quick="data">
            <div>
                <button v-on:click="viewMode(data.value)" type="button" class="btn btn-secondary btn-sm button-space">
                    <i class="bi bi-journal"></i> Ver
                </button>
            </div>
        </template>
    </table-lite>
</template>

<style></style>
