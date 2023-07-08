<template>
    <div id="sidebar">
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
            <div class="my-1 px-2 d-flex w-100">

                <div type="submit" @click="logoutButton" class=" w-100 item-menu m-0 ">
                    <div class="py-2 px-3"><i class="bi bi-arrow-bar-left"></i> Cerrar Sesión</div>
                </div>
            </div>
            <div class="my-1 px-2 d-flex w-100">

                <div type="submit" @click="switchLoading()" class=" w-100 item-menu m-0 ">
                    <div class="py-2 px-3"><i class="bi bi-arrow-bar-left"></i> Loading</div>
                </div>
            </div>
        </div>
    </div>
    <div id="content">
        <TopBar :title="title.name" :icon="title.icon" :breadcrumb="title.breadcrumb">


        </TopBar>
        <div class="p-3">
            <RouterView v-slot="{ Component }">
                <transition name="slide-fade" mode="out-in">
                    <component :is="Component" :changeTitle="changeTitle" :showToast="showToast"
                        :confirmDialogue="confirmDialogue" />

                </transition>
            </RouterView>
        </div>

    </div>
    <MyToast ref="toast"></MyToast>
    <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
</template>
<script>
import axios from "axios";
import AuthService from "@/services/AuthService";
import Icon from '@/components/my_components/Icon.vue'
import TopBar from "@/components/my_components/TopBar.vue";
import ConfirmDialogue from "@/components/my_components/ConfirmDialogue.vue";
import MyToast from "@/components/my_components/MyToast.vue";

import { defineComponent } from "vue";
export default defineComponent({
    name: "Sidebar",
    components: {
        Icon, TopBar, ConfirmDialogue,
        MyToast,
    },
    data() {
        return {
            newTask: "",
            title: {
                name: "",
                icon: "",
                breadcrumb: []
            },
            list: [
                {
                    title: "Inicio",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-house",
                    url: "/"
                },
                {
                    title: "Usuario",
                    desc: "Perfil del Usuario, donde se pone los datos internos de la pag.",
                    icon: "bi bi-person-vcard",
                    url: "/user"
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
        changeTitle(title) {
            this.title.name = title.name;
            this.title.icon = title.icon;
            this.title.breadcrumb = title.breadcrumb
        },
        showToast(opts = {}) {
            this.$refs.toast.show(opts);
        },
        async confirmDialogue(opts = {}) {
            var resp = false;
            await this.$refs.confirmDialogue
                .show({
                    title: opts.title,
                    message: opts.message,
                    okButton: opts.okButton,
                }).then((result) => {
                    resp = result
                }
                )
            return resp;
        },
        logout() {
            this.$store.dispatch("logout");
            this.$router.push("/login");
        },
        logoutButton(evt) {
            evt.preventDefault();
            this.logout();
        },

    },
    created() {

        const credentials = {
            username: "admin",
            password: "jose123as",
        };
        if (!this.$store.getters.isActive) {
            this.logout();
        }
    },
    async updated() {
        if (!this.$store.getters.isActive) {
            this.logout();
            return;
        }
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
.slide-fade-enter-active {
    transition: all 0.25s ease;
}
.slide-fade-enter {
    transition: all 0.25s ease;
}

.slide-fade-leave-active {}

.slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.slide-fade-enter-from

/* .slide-fade-leave-active below version 2.1.8 */
    {

    opacity: 0;
}

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
    overflow-x: hidden;
}
</style>