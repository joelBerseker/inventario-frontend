<script>
import { defineComponent } from "vue";
import Icon from '@/components/my_components/Icon.vue'
export default defineComponent({
    name: "App",
    data() {
        return {
            loading: true,
        };
    },
    components: {
        Icon
    },
    methods: {
        loadingApp(loading) {
            if (loading) {
                this.loading = loading
            } else {
                setTimeout(() => { this.loading = loading }, 300);
            }
        },
        logout() {
            this.$store.dispatch("logout");
            this.$router.push("/login");
        },
    },
    created() {
        if (!this.$store.getters.isActive || this.$store.getters.isActive==null) {
            console.log("no paso");
            this.logout()
        } else {
            console.log("paso xd");
            var link = window.location.href;
            var linkSlice = link.substring(link.lastIndexOf("/"), link.length)
            if(linkSlice == "/login"){
                console.log("paso al main");
                this.$router.push("/");
            }
            console.log("vino de aqui -> "+link);
            console.log("lo reenvio aqui -> "+linkSlice);
        }
    },
})
</script>
<template>
    <div id="app">
        <transition name="t-app" mode="out-in">
            <div :key="loading">
                <div v-show="!loading">
                    <RouterView :loadingApp="loadingApp" />
                </div>
                <div v-show="loading" class="center flex-column">
                    <div><Icon size="55px" :speed="true" :mode="6"></Icon></div>
                    <div class="secondary-text">Cargando aplicación...</div> 
                </div>
            </div>
        </transition>
    </div>
</template>
<style scoped>
#app {
    overflow-x: hidden;
}

.center {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.t-app-enter-active,
.t-app-enter {
    transition: all 0.25s ease;
}

.t-app-leave-active {
    transition: all 0.25s ease;
}

.t-app-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.t-app-enter-from {
    transform: translateX(-10px);
    opacity: 0;
}
</style>