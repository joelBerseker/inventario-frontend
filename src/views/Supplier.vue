<script setup>
import AddCustomer from '../components/AddCustomer.vue'
</script>
<template>
    <!-- Modal -->
    <AddCustomer/>
    <div>
        <h1>Clientes</h1>

        <button type="button" class="btn btn-dark mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal">Agregar</button>
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Nombres</th>
                    <th>RUC</th>
                    <th>Direccion</th>
                    <th>Telefono</th>
                    <th>Correo Electronico</th>
                    <th>Ultimo ingresado</th>
                    <th>Acciones</th> 
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Jhon Mamani</td>
                    <td>74578899911</td>
                    <td>En la Esquina</td>
                    <td>9544477711</td>
                    <td>jhon@kun.com</td>
                    <td>10-09-05</td>
                    <td><button>EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Jhon Mamani</td>
                    <td>74578899911</td>
                    <td>En la Esquina</td>
                    <td>9544477711</td>
                    <td>jhon@kun.com</td>
                    <td>10-09-05</td>
                    <td><button>EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Jhon Mamani</td>
                    <td>74578899911</td>
                    <td>En la Esquina</td>
                    <td>9544477711</td>
                    <td>jhon@kun.com</td>
                    <td>10-09-05</td>
                    <td><button>EDITAR</button></td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Jhon Mamani</td>
                    <td>74578899911</td>
                    <td>En la Esquina</td>
                    <td>9544477711</td>
                    <td>jhon@kun.com</td>
                    <td>10-09-05</td>
                    <td><button>EDITAR</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style></style>