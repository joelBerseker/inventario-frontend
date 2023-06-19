<template>
    <div class="d-flex flex-column align-items-center">
        <div class="mt-4 mb-4 px-3 main-text">
            <p class="title-text text-center">Sistema de Inventarios</p>
        </div>
        <div class="py-1 px-2 d-flex w-100">
            <RouterLink to="/" class="w-100 item-menu m-0">
                <div class="py-2 px-3"><i class="bi bi-house"></i> Inicio</div>
            </RouterLink>
        </div>
        <div class="py-1 px-2 d-flex w-100">
            <RouterLink to="/product" class="w-100 item-menu m-0">
                <div class="py-2 px-3"><i class="bi bi-box-seam"></i> Productos</div>
            </RouterLink>
        </div>
        <div class="py-1 px-2 d-flex w-100">
            <RouterLink to="/supplier" class="w-100 item-menu m-0">
                <div class="py-2 px-3"><i class="bi bi-people"></i> Clientes</div>
            </RouterLink>
        </div>
        <div class="py-1 px-2 d-flex w-100">
            <RouterLink to="/customer" class="w-100 item-menu m-0">
                <div class="py-2 px-3"><i class="bi bi-truck"></i> Proveedores</div>
            </RouterLink>
        </div>
    </div>
</template>
<style scoped>
.item-menu {
    text-decoration-line: none;
    color: var(--my-1th-color);
    border-radius: 0.5rem !important;
    margin: 0.25rem;
}

.main-text {
    color: var(--my-1th-color);
}

.item-menu:hover,
.router-link-exact-active {
    background-color: var(--my-3th-color);
}
</style>