<script>
import AddProduct from "../components/Product/AddProduct.vue";
import axios from "axios";
import { defineComponent } from "vue";
const url = import.meta.env.VITE_APP_RUTA_API;
export default defineComponent({
    name: "Product",
    data() {
        return {
            mode: 1,
            loading: false,
            newTask: "",
            tasks: [],
        };
    },
    components: {
        AddProduct,
    },
    created() {
        this.getTasks();
    },
    methods: {
        async getTasks() {
            this.loading = true;
            var path = url + `products/products/`;
            console.log(path);
            axios.get(path)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })

        },
        edit(){
            this.mode=2;
            console.log(this.mode)
        }
    },
});
</script>
<template>
    <!-- Modal 
        Mode 1: Create
        Mode 2: View
        Mode 3: Edit
    -->
    <AddProduct :mode=mode />
    <div>
        <h1>Productos</h1>

        <button v-on:click="edit" type="button" class="btn btn-dark mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Agregar
        </button>
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Ultimo ingresado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Prod1</td>
                    <td>1</td>
                    <td>10-09-05</td>
                    <td><button>ADD</button><button>EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Prod1</td>
                    <td>1</td>
                    <td>10-09-05</td>
                    <td><button>ADD</button><button >EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Prod1</td>
                    <td>1</td>
                    <td>10-09-05</td>
                    <td><button>ADD</button><button>EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Prod1</td>
                    <td>1</td>
                    <td>10-09-05</td>
                    <td><button>ADD</button><button>EDITAR</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script></script>

<style></style>
