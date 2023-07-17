<script>
import Content from '@/components/home/Content.vue'
import { defineComponent } from "vue";

export default defineComponent({
    name: "templateContent",
    props: ["changeTopbar", "showToast", "confirmDialogue"],
    components: {
        Content,
    },
    data() {
        return {
            loading: false,
            topbar: {
                title: "Agregar por Excel",
                icon: "icon",
                breadcrumb: [
                    {
                        name: "Inicio",
                        link: "/home"
                    },
                    {
                        name: "Productos",
                        link: "/product"
                    },
                    {
                        name: "Agregar por Excel",
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
        here information
    </Content>
</template>

<style scoped>
</style>
