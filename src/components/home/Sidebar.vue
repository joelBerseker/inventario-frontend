<template>
    <div class="d-flex flex-column align-items-center">
        <div class="mt-4 mb-2 px-3 main-text ">
            <div class="d-flex flex-column align-items-center">
                <Icon size="55px"></Icon>
            </div>
            <p class="title-text text-center">Gestion de inventarios</p>
        </div>
        <div class="d-flex w-100 color-1 px-3 my-0 py-0">
            <hr class="w-100 my-2" />
        </div>
        <div v-for="item in list" :key="item.title" class="my-1 px-2 d-flex w-100">
            <RouterLink :to="item.url" class="w-100 item-menu m-0">
                <div class="py-2 px-3"><i :class="item.icon"></i> {{ item.title }}</div>
            </RouterLink>
        </div>
        <div class="d-flex w-100 color-1 px-3">
            <hr class="w-100 my-2" />
        </div>
        <div class="my-1 px-2 d-flex w-100 ">
            <RouterLink to="/about" class="w-100 item-menu m-0 ">
                <div class="py-2 px-3"><i class="bi bi-info-circle "></i> Mas información</div>
            </RouterLink>
        </div>

    </div>
</template>
<script>
import Icon from '@/components/my_components/Icon.vue'
import { defineComponent } from "vue";
export default defineComponent({
    name: "Sidebar",
    components: {
        Icon,
    },
    data() {
        return {
            list: [
                {
                    title: "Inicio",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-house",
                    url: "/home"
                },
                {
                    title: "Entradas",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-box-arrow-in-right",
                    url: "/inputs"
                },
                {
                    title: "Salidas",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-box-arrow-left",
                    url: "/outputs"
                },
                {
                    title: "Productos",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-box-seam",
                    url: "/product"
                },
                {
                    title: "Clientes",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-people",
                    url: "/customer"
                },
                {
                    title: "Proveedores",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-truck",
                    url: "/supplier"
                }
            ]
        };
    },
});
</script>
<style scoped>
.item-menu {
    text-decoration-line: none;
    color: var(--my-1th-color);
    border-radius: var(--my-border-radius) !important;
    margin: 0.25rem;
    transition: 0.8s;
    transform: translateX(0px);
}

.item-menu::before {
    content: '';
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--my-border-radius) !important;
    z-index: -3;
    transform: translateX(-10px);
    transition: 0.4s;
}

.main-text {
    color: var(--my-1th-color);
}

.item-menu:hover::before,
.router-link-exact-active::before {
    background-color: var(--my-3th-color);
    transform: translateX(0px);
}

</style>