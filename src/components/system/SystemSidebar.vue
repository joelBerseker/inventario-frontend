<script>
import Icon from '@/components/my_other_components/Icon.vue'
import { defineComponent } from "vue";
export default defineComponent({
    name: "Sidebar",
    components: {
        Icon,
    },

    data() {
        return {
            showSidebar: true,
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
                },
                {
                    title: "Categorias",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-tag",
                    url: "/category"
                },
                {
                    title: "Mas información",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-info-circle",
                    url: "/about"
                },
            ]
        };

    },
    methods: {
        closeSidebar() {
            document.getElementById("sidebar").style.width = "63px";
            document.getElementById("main-content").style.marginLeft = "63px";
            this.showSidebar = false;
        },
        openSidebar() {
            document.getElementById("sidebar").style.width = "250px";
            document.getElementById("main-content").style.marginLeft = "250px";
            setTimeout(() => {
                this.showSidebar = true;
            }, 200);

        },
        sidebarButton() {
            if (this.showSidebar) {
                this.closeSidebar()
            } else {
                this.openSidebar()
            }
        }
    }
});
</script>
<template>
    <div class="d-flex flex-column align-items-center h-100">
        <transition name="t-sidebar-item" mode="out-in">
            <div class="mt-3 mb-2 px-3 main-text " v-if="showSidebar">
                <div class="d-flex flex-column align-items-center">
                    <Icon size="55px"></Icon>

                </div>

                <p class="title-text text-center">Gestion de inventarios</p>
            </div>
            <div v-else class="mt-3 mb-2 px-3 main-text ">
                <div class="d-flex flex-column align-items-center">
                    <Icon size="40px" class="mt-5"></Icon>
                </div>
            </div>
        </transition>
        <button @click="sidebarButton()" type="button" class="btn btn-primary-outline btn-sm btn-sidebar">
            <i class="bi bi-list"></i>
        </button>

        <div class="d-flex w-100 my-c1 px-3 my-0 py-0">
            <hr class="w-100 my-2" />
        </div>
        <div v-for="item in list" :key="item.title" class="my-1 px-2 d-flex w-100">
            <RouterLink :to="item.url" class="w-100 item-menu m-0">
                <div class="content-item-menu">
                    <i :class="item.icon"></i>
                    <transition name="t-sidebar-item" mode="out-in">
                        <span v-show="showSidebar">&nbsp;{{ item.title }}</span>
                    </transition>

                </div>
            </RouterLink>
        </div>
      
        <transition name="t-sidebar-item" mode="out-in">
        <div v-show="showSidebar" class="my-c1 footer-text">
            Desarrollado por Gleaming Glow Team
        </div>
    </transition>
    </div>
</template>
<style scoped>
.footer-text{
    font-size: 0.6rem;
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 1rem;
    margin-right: 1rem;

}
.t-sidebar-item-enter-active,
.t-sidebar-item-enter {
    transition: all 0.4s ease;
}

.t-sidebar-item-leave-active {}

.t-sidebar-item-leave-to {
    transform: translateY(10px);
    opacity: 0;
}

.t-sidebar-item-enter-from {
    opacity: 0;
}

.item-menu {
    text-decoration-line: none;
    color: var(--my-c1);
    border-radius: var(--my-br) !important;
    margin: 0.25rem;
    transform: translateX(0px);
}

/*.item-menu::before {
    content: '';
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--my-br) !important;
    z-index: -3;
    /*transform: translateX(-10px); 
    transition: 0.5s;
}
.item-menu:hover::before,
.router-link-exact-active::before {
    background-color: var(--my-c3);
    transform: translateX(0px);
}
*/
.main-text {
    color: var(--my-c1);
    height: 88px;
}


.content-item-menu {
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: var(--my-br);
}
.content-item-menu:hover,
.router-link-exact-active .content-item-menu {
  background-color: var(--my-c3);
}
.btn-sidebar {
    position: absolute;
    margin-top: 1rem;
    right: 1rem;
}
</style>