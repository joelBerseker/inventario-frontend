<script>
import MainContent from "@/components/my_components/MainContent.vue";
import axios from "axios";
import AuthService from "@/services/AuthService";
import AddInput from "../Input/AddInput.vue";
const url = import.meta.env.VITE_APP_RUTA_API;
import { defineComponent } from "vue";
export default defineComponent({
    name: "Inputs",
    data() {
        return {
            tasks: [],
        };
    },
    props: [
        "changeTitle",
    ],
    created() {
        this.changeTitle({name:"Entradas", icon:"bi bi-box-arrow-left"})
        //this.getTasks();
        const credentials = {
            username: "admin",
            password: "jose123as",
        };
        console.log(credentials);
        //AuthService.obtain_token(credentials);
    },
    methods: {
        async getTasks() {
            this.loading = true;
            var path = url + `products/products/`;
            console.log(path);
            axios.get(path).then(function (response) {
                // handle success
                console.log(response.data);
            });
        },
    },
    components: {
        AddInput,
        MainContent
    },
});
</script>
<template>
    <!-- Modal -->
    <AddInput />
    <MainContent :title="'Entradas'" :icon="'bi bi-arrow-bar-right'">
        <button type="button" class="btn btn-primary btn-sm mb-3" data-bs-toggle="modal" data-bs-target="#exampleModal"
            data-bs-whatever="@mdo">
            <i class="bi bi-plus-circle"></i> Agregar Entrada
        </button>

        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Numero de Factura</th>
                    <th>Fecha</th>
                    <th>PROVEEDOR</th>
                    <th>Ultima Edicion</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Jhon Mamani</td>
                    <td>74578899911</td>
                    <td>En la Esquina</td>
                    <td>10-09-05</td>
                    <td><button>EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Jhon Mamani</td>
                    <td>74578899911</td>
                    <td>En la Esquina</td>
                    <td>10-09-05</td>
                    <td><button>EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Jhon Mamani</td>
                    <td>74578899911</td>
                    <td>En la Esquina</td>
                    <td>10-09-05</td>
                    <td><button>EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Jhon Mamani</td>
                    <td>74578899911</td>
                    <td>En la Esquina</td>
                    <td>10-09-05</td>
                    <td><button>EDITAR</button></td>
                </tr>
            </tbody>
        </table>
    </MainContent>
</template>

<style></style>
