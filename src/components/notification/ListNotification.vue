<script>
import Content from '@/components/home/Content.vue'
import { defineComponent } from "vue";

export default defineComponent({
    name: "ListNotification",
    props: ["changeTopbar", "showToast", "confirmDialogue"],
    components: {
        Content,
    },
    data() {
        return {
            loading: false,
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
        loadingContent(loading) {
            this.$refs.content.loadingContent(loading);
        },
    },
    async created() {
        this.changeTopbar(this.topbar);
    },
});
</script>
<template>
    <Content ref="content" :loading="loading">
        Notificaciones
    </Content>
</template>

<style scoped>
</style>
