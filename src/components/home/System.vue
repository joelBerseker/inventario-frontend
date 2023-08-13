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
    props: [
        "loadingApp",
    ],
    data() {
        return {
            topbar: {
                title: "",
                icon: "",
                breadcrumb: []
            },
        };
    },
    methods: {
        loadingSystem(loading) {
            if (loading) {
                this.$refs.loadingSystem.openModal();
            } else {
                this.$refs.loadingSystem.closeModal();
            }
        },
        changeTopbar(topbar) {
            this.topbar.title = topbar.title;
            this.topbar.icon = topbar.icon;
            this.topbar.breadcrumb = topbar.breadcrumb
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
        this.loadingApp(false);
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
<template>
    <div id="sidebar">
        <SideBar></SideBar>
    </div>
    <div id="main-content" class="dark-mode">
        <TopBar :loadingApp="loadingApp" :topbar="topbar" :confirmDialogue="confirmDialogue"></TopBar>

        <RouterView v-slot="{ Component }">
            <transition name="t-main-content" mode="out-in">
                <component :is="Component" :changeTopbar="changeTopbar" :showToast="showToast"
                    :confirmDialogue="confirmDialogue" />
            </transition>
        </RouterView>

    </div>
    <MyToast ref="toast"></MyToast>
    <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
    <LoadingSystem ref="loadingSystem"></LoadingSystem>
</template>
<style scoped>
.t-main-content-enter-active,
.t-main-content-enter {
    transition: all 0.4s ease;
}

.t-main-content-leave-active {}

.t-main-content-leave-to {
    transform: translateY(10px);
    opacity: 0;
}

.t-main-content-enter-from {
    opacity: 0;
}

#sidebar {
    overflow: hidden;
    height: 100%;
    width: 250px;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    background-color: var(--my-2th-color);
    border-right: 1px solid rgba(255, 255, 255, 0.164);
    transition: width 0.3s;
}

#main-content {
    transition: margin-left 0.3s;
    margin-left: 250px;
    min-height: 100vh;
    background-size: cover;
    overflow-x: hidden;
}
</style>