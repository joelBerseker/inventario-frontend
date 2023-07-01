<template>
    <div id="sidebar">
        <div class="d-flex flex-column align-items-center">
            <div class="mt-4 mb-2 px-3 main-text">
                <p class="title-text text-center">Sistema de Inventarios</p>
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
                <RouterLink to="/inputs" class="w-100 item-menu m-0 ">
                    <div class="py-2 px-3"><i class="bi bi-info-circle "></i> Mas información</div>
                </RouterLink>
            </div>
            <div class="my-1 px-2 d-flex w-100">
                <RouterLink to="/inputs" class="w-100 item-menu m-0">
                    <div class="py-2 px-3"><i class="bi bi-arrow-bar-left"></i> Cerrar Sesión</div>
                </RouterLink>
            </div>
        </div>
    </div>
    <div id="content">
        <RouterView />
    </div>
</template>
<script>
import axios from "axios";
import AuthService from "@/services/AuthService";

import { defineComponent } from "vue";
export default defineComponent({
    name: "Sidebar",
    data() {
        return {
            newTask: "",
            list: [
                {
                    title: "Inicio",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-house",
                    url: "/"
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
    methods: {
        logout() {
            this.$store.dispatch("logout");
            this.$router.push("/login");
        },

    },
    created() {

        const credentials = {
            username: "admin",
            password: "jose123as",
        };
        //AuthService.obtain_token(credentials);
    },
    async updated() {
        const tokenActual = {
            refresh: this.$store.getters.isLoggedIn2,
        };
        try {
            const obtainToken = await AuthService.refresh_token(tokenActual);
            const token = obtainToken.access;
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (e) {
            console.log(e);
            axios.defaults.headers.common["Authorization"] = null;
            this.logout();
        }
    },
});
</script>
<style scoped>
.prueba {
    position: absolute;
    top: 0;
    color: white;
}

.item-menu {
    text-decoration-line: none;
    color: var(--my-1th-color);
    border-radius: 0.5rem !important;
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
    border-radius: 0.5rem !important;
    z-index: -3;
    transform: translateX(-15px);
    transition: 0.3s;
}

.main-text {
    color: var(--my-1th-color);
}

.item-menu:hover::before,
.router-link-exact-active::before {
    background-color: var(--my-3th-color);
    transform: translateX(0px);
}

#sidebar {
    overflow: hidden;
    height: 100%;
    /* 100% Full-height */
    width: 250px;
    /* 0 width - change this with JavaScript */
    position: fixed;
    /* Stay in place */
    z-index: 100;
    /* Stay on top */
    top: 0;
    /* Stay at the top */
    left: 0;
    background-color: var(--my-2th-color);
}

#content {
    transition: margin-left 0.5s;
    margin-left: 250px;

    min-height: 100vh;
    background-size: cover;
}
</style>