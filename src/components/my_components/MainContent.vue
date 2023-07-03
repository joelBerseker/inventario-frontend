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
    <div class="bg-color-3 py-3 px-3 color-1 content">
        <transition name="slide-fade" mode="out-in" >
            <div :key="title">
                <p class="title-text "><i :class=icon></i> {{ title }}</p>
                <div class="row mt-2" v-if="title!='Inicio'">
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

        </transition>
    </div>

    <div class="p-3">
        <slot></slot>
    </div>
</template>
<style scoped>

.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-enter {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-to{
    transform: translateX(10px);
    opacity: 0;
}

.slide-fade-enter-from
/* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(-10px);
    opacity: 0;
}

.breadcrumb-ol {
    --bs-breadcrumb-divider-color: var(--my-1th-color);
}

.content{
    transition: 0.5s;

}
.breadcrumb a {
    color: var(--my-1th-color);
}

.margin-breadcrumb {
    margin-left: 1.5rem;
}

.breadcrumb .active {
    color: rgba(255, 255, 255, 0.527);
}
</style>
