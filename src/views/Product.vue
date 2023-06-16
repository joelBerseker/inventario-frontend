<script setup lang="ts">
import AddProduct from '../components/AddProduct.vue'
</script>
<template>
    <!-- Modal -->
    <AddProduct/>
    <div>
        <h1>Productos</h1>

        <button type="button" class="btn btn-dark mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal">Agregar</button>
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
                    <td><button>ADD</button><button>EDITAR</button></td>
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

<style></style>
