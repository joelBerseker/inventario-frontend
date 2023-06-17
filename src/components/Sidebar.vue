<template>
    <div class="d-flex flex-column align-items-center min-vh-100">
        <div class="mt-5 mb-4 px-3 main-text">Sistema de Inventarios</div>

        <RouterLink to="/" class="w-100 item-menu">
            <div class="py-2 px-3">Inicio</div>
        </RouterLink>
        <RouterLink to="/product" class="w-100 item-menu">
            <div class="py-2 px-3">Productos</div>
        </RouterLink>
        <RouterLink to="/supplier" class="w-100 item-menu">
            <div class="py-2 px-3">Clientes</div>
        </RouterLink>
        <RouterLink to="/customer" class="w-100 item-menu">
            <div class="py-2 px-3">Proveedores</div>
        </RouterLink>
        
    </div>
</template>
<style scoped>
.item-menu{
    text-decoration-line: none;
    color: var(--my-1th-color);
}
.main-text{
    color: var(--my-1th-color);
}
.item-menu:hover{
    background-color: var(--my-3th-color);
}
.router-link-exact-active{
    background-color: var(--my-3th-color);
}
</style>