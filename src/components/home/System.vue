<template>
    <div id="sidebar">
        <SideBar></SideBar>
    </div>
    <div id="content">
        <TopBar :title="title.name" :icon="title.icon" :breadcrumb="title.breadcrumb" :confirmDialogue="confirmDialogue"></TopBar>
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
    <LoadingSystem ref="loadingSystem"></LoadingSystem>
</template>
<script>
import axios from "axios";
import AuthService from "@/services/AuthService";
import Icon from '@/components/my_components/Icon.vue'
import ConfirmDialogue from "@/components/my_components/ConfirmDialogue.vue";
import MyToast from "@/components/my_components/MyToast.vue";

import TopBar from "@/components/home/TopBar.vue";
import LoadingSystem from "@/components/home/LoadingSystem.vue";
import SideBar from "@/components/home/SideBar.vue";

import { defineComponent } from "vue";
export default defineComponent({
    name: "System",
    components: {
        Icon, TopBar, ConfirmDialogue,
        MyToast, LoadingSystem, SideBar
    },
    data() {
        return {
            title: {
                name: "",
                icon: "",
                breadcrumb: []
            },
        };
    },
    methods: {
        loadingSystem(loading) {
            if(loading){
                this.$refs.loadingSystem.openModal();
            }else{
                this.$refs.loadingSystem.closeModal();
            }
        },
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
    border-right: 1px solid rgba(255, 255, 255, 0.164);
}

#content {
    transition: margin-left 0.5s;
    margin-left: 250px;

    min-height: 100vh;
    background-size: cover;
    overflow-x: hidden;
}
</style>