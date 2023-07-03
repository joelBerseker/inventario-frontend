<script>
import { defineComponent } from "vue";
export default defineComponent({
    name: "MainContent",
    props: [
        "title", "icon"
    ],
});
</script>
<template>
    <div class="bg-color-3 py-3 px-3 color-1">
        <p class="title-text "><i :class=icon></i> {{ title }}</p>
        <div class="row mt-2">
            <div class="col-auto">
                <i class="bi bi-arrow-left-circle"></i> <a to="/home" class=" color-1">Atras</a>
            </div>
            <div class="col">
                <nav aria-label="breadcrumb" class="color-1 margin-breadcrumb">
                    <ol class="breadcrumb mb-0  breadcrumb-ol">
                        <li class="breadcrumb-item"><a href="#">Inicio</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Productos</li>
                    </ol>
                </nav>
            </div>
        </div>

    </div>
    <div class="p-3">
        <slot></slot>
    </div>
</template>
<style scoped>
.breadcrumb-ol {
    --bs-breadcrumb-divider-color: var(--my-1th-color);
}

.breadcrumb a {
    color: var(--my-1th-color);
}
.margin-breadcrumb{
    margin-left: 1.5rem;
}

.breadcrumb .active {
    color: rgba(255, 255, 255, 0.527);
}
</style>
