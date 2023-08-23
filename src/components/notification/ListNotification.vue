<script>
import SystemContent from '@/components/system/SystemContent.vue'
import { defineComponent } from "vue";

export default defineComponent({
    name: "ListNotification",
    props: ["changeTopbar"],
    components: {
        SystemContent,
    },
    data() {
        return {
            loadingContentSystem: false,
            topbar: {
                title: "Notificaciones",
                icon: "icon",
                breadcrumb: [
                    {
                        name: "Inicio",
                        link: "/home"
                    },
                    {
                        name: "Notificaciones",
                        link: ""
                    },

                ],
            }
        };

    },
    methods: {
    },
    async created() {
        this.changeTopbar(this.topbar);
    },
});
</script>
<template>
    <SystemContent ref="content" :loading="loadingContentSystem">
        Notificaciones
    </SystemContent>
</template>

<style scoped>
</style>
