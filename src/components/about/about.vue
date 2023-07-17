<script>
import Content from '@/components/home/Content.vue'
import { defineComponent } from "vue";

export default defineComponent({
    name: "About",
    props: ["changeTopbar", "showToast", "confirmDialogue"],
    components: {
        Content,
    },
    data() {
        return {
            loading: false,
            topbar: {
                title: "Mas información",
                icon: "bi bi-info-circle",
                breadcrumb: [
                    {
                        name: "Inicio",
                        link: "/home"
                    },
                    {
                        name: "Mas informacion",
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
        <a href="https://docs.google.com/spreadsheets/d/1shM2f3sb77z6Hm93w9DS7nfRkxQ9cxRTWAmNqDJ0y_c/edit#gid=0">Drive</a>
    </Content>
</template>

<style scoped></style>
