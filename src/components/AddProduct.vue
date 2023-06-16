<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">AGREGAR PRODUCTO</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required><br><br>
                    
                    <label for="descripcion">Descripción:</label>
                    <textarea id="descripcion" name="descripcion" required></textarea><br><br>
                    
                    <label for="codigo">Código:</label>
                    <input type="text" id="codigo" name="codigo" required><br><br>
                    
                    <label for="costo">Costo:</label>
                    <input type="number" id="costo" name="costo" step="0.01" required><br><br>
                    
                    <label for="precio">Precio de Venta:</label>
                    <input type="number" id="precio" name="precio" step="0.01" required><br><br>
                    
                    <label for="inventario">Cantidad en Inventario:</label>
                    <input type="number" id="inventario" name="inventario" required><br><br>
                    
                    <label for="nivel_minimo">Nivel Mínimo:</label>
                    <input type="number" id="nivel_minimo" name="nivel_minimo" required><br><br>
                    
                    <label for="nivel_maximo">Nivel Máximo:</label>
                    <input type="number" id="nivel_maximo" name="nivel_maximo" required><br><br>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>