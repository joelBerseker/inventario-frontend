<script>
import { defineComponent, renderSlot } from "vue";

export default defineComponent({
    name: "TopBar",
    props: [
        "topbar", "confirmDialogue", "loadingApp"
    ],
    methods: {
        confirmLogout(){
            this.confirmDialogue({
                    title: "Cerrar Sesión",
                    message: "¿Esta seguro que desea cerrar sesión?",
                    okButton: "Aceptar",
                }).then((result) => {
                    if (result) {
                        this.logout();
                    }
                })
        },
        logoutButton(evt) {
            evt.preventDefault();
            this.confirmLogout();
        },
        logout() {
            this.loadingApp(true)
            this.$store.dispatch("logout");
            this.$router.push("/login");
        },
    },
    computed: {
        styleBreadcrumb: function () {
            var resp = ""
            if (this.topbar.breadcrumb.length <= 1) {
                resp = "height: 0px"
            } else {
                resp = "height: 22px"
            }
            return resp
        }
    },

});
</script>
<template>
    <div class="bg-color-2 py-3 px-3 color-1 content">
        <div class="row">
            <div class="col">
                <transition name="slide-fade" mode="out-in">

                    <p :key="topbar.title" class="title-text "><i :class=topbar.icon></i> {{ topbar.title }}</p>

                </transition>
            </div>
            <div class="col text-end">
                <button v-on:click="this.$router.push('/user');" type="button" class="btn btn-primary-outline btn-sm me-1">
                    <i class="bi bi-person-vcard"></i> Usuario
                </button>
                <button v-on:click="logoutButton" type="button" class="btn btn-primary-outline btn-sm me-1">
                    <i class="bi bi-bell"></i>
                </button>
                <button v-on:click="logoutButton" type="button" class="btn btn-primary-outline btn-sm">
                    <i class="bi bi-power"></i>
                </button>
            </div>

        </div>

        <div :style="styleBreadcrumb" class="breadcrumb-content">
            <div v-if="topbar.breadcrumb.length <= 1">
            </div>
            <div v-else>
                <div class="row mt-2">
                    <div class="col-auto breadcrumb-item">
                        <span v-if="topbar.breadcrumb.length > 1"><i class="bi bi-arrow-left-circle"></i>
                            <RouterLink :to="topbar.breadcrumb[topbar.breadcrumb.length - 2].link" class="color-1"> Atras</RouterLink>
                        </span>
                        <span v-else class="active"><i class="bi bi-arrow-left-circle"></i> Atras</span>
                    </div>
                    <div class="col">
                        <transition name="slide-fade" mode="out-in">
                            <nav :key="topbar.title" aria-label="breadcrumb" class="color-1 margin-breadcrumb">
                                <ol class="breadcrumb mb-0  breadcrumb-ol">

                                    <li v-for="(item, index) in topbar.breadcrumb" :key="item.name" class="breadcrumb-item">
                                        <RouterLink v-if="index <= topbar.breadcrumb.length - 2" :to="item.link" class="color-1">{{
                                            item.name }}
                                        </RouterLink>
                                        <span class="active" v-else>{{ item.name }}</span>

                                    </li>
                                </ol>
                            </nav>
                        </transition>
                    </div>

                </div>
            </div>
        </div>

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
    /*transition: all 0.25s ease;*/
}

.slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.slide-fade-enter-from

/* .slide-fade-leave-active below version 2.1.8 */
    {
    transform: translateX(-10px);
    opacity: 0;
}


.breadcrumb-content {
    transition: 0.3s;
}

.breadcrumb-ol {
    --bs-breadcrumb-divider-color: var(--my-1th-color);
}

.content {
    transition: 0.5s;
    border-left: 1px solid rgba(255, 255, 255, 0.137);

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

.active {
    color: rgba(255, 255, 255, 0.527) !important;
}
</style>
