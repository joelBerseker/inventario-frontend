<script>
import DetailCustomer from "./DetailCustomer.vue";
import Content from '@/components/home/Content.vue'
import axios from "axios";
import TableLite from "vue3-table-lite";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";

const url = import.meta.env.VITE_APP_RUTA_API;
import { defineComponent } from "vue";
export default defineComponent({
    name: "Customer",

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
                        label: "Correo",
                        field: "mail",
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
            breadcrumb: [
                {
                    name: "Inicio",
                    link: "/home"
                },
                {
                    name: "Clientes",
                    link: ""
                },

            ],
            loading: true,
        };
    },
    mixins: [UtilityFunctions],
    components: {
        DetailCustomer,
        TableLite,
        Content,
    },
    props: [
        "changeTitle", "showToast", "confirmDialogue"
    ],
    async created() {
        this.changeTitle({ name: "Clientes", icon: "bi bi-people", breadcrumb: this.breadcrumb })
        if (this.$store.getters.isActive) {
            await this.getCustomers();
        }
    },
    methods: {
        changeLoading(_loading) {
            setTimeout(() => { this.loading = _loading }, 30);
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
            })
                .then((result) => {
                    if (result) {
                        var path = url + "clients/clients/" + row.id + "/";
                        axios.delete(path).then((response) => {
                            console.log(response);
                            this.showToast({
                                title: "Eliminar Registro",
                                message: "Operación exitosa",
                                type: 1,
                            });
                            this.getCustomers();
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

        async getCustomers() {
            this.table.rows = [];
            var path = url + `clients/clients/`;
            axios.get(path).then((response) => {
                response.data.results.forEach((element) => {
                    this.table.rows.push(element);
                    this.table.totalRecordCount = this.table.rows.length;
                    
                });
                this.changeLoading(false)
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
    <Content ref="mainContent" :loading="loading">
        <DetailCustomer ref="modal" :deleteItem="deleteItem" :showToast="showToast" :item_selected="item_selected"
            :getCustomers="getCustomers" />
        <div class="row justify-content-md-end">
            <div class="col-6">

                <button v-on:click="addMode" type="button" class="btn btn-primary btn-sm mb-3">
                    <i class="bi bi-plus-circle"></i> Agregar Cliente
                </button>
            </div>
            <div class="col">
                <div class="input-group input-group-sm">


                    <div class="dropdown">
                        <button class="btn btn-sm btn-secondary margin-dropdown" type="button" id="dropdownMenuLink"
                            data-bs-toggle="dropdown">
                            <i class="bi bi-sliders"></i>
                            Filtro
                        </button>
                        <div class="dropdown-menu p-4 text-muted" style="max-width: 200px;">
                            <p>
                                Some example text that's free-flowing within the dropdown menu.
                            </p>
                            <p class="mb-0">
                                And this is more example text.
                            </p>
                        </div>
                    </div>
                    <input type="text" class="form-control form-control-sm" id="name" name="name" required />
                    <button class="btn btn-sm btn-secondary" type="button"><i class="bi bi-search"></i></button>

                </div>
            </div>
        </div>

        <table-lite :is-static-mode="true" :is-slot-mode="true" :is-loading="table.isLoading" :columns="table.columns"
            :rows="table.rows" :total="table.totalRecordCount" :sortable="table.sortable"
            @is-finished="table.isLoading = false" :messages="table.messages">
            <template v-slot:quick="data">
                <div>
                    <button v-on:click="viewMode(data.value)" type="button" class="btn btn-secondary btn-sm">
                        <i class="bi bi-journal"></i>
                    </button>
                </div>
            </template>
        </table-lite>
    </Content>
</template>

<style scoped>
.margin-dropdown {
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
}
</style>