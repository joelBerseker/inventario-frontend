<script>
import SystemContent from '@/components/home/SystemContent.vue'
import { defineComponent } from "vue";

export default defineComponent({
    name: "templateContent",
    props: ["changeTopbar", "showToast", "confirmDialogue"],
    components: {
        SystemContent,
    },
    data() {
        return {
            loading: false,
            topbar: {
                title: "templateContent",
                icon: "icon",
                breadcrumb: [
                    {
                        name: "Inicio",
                        link: "/home"
                    },
                    {
                        name: "templateContent",
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
    <SystemContent ref="content" :loading="loading">
        here information
    </SystemContent>
</template>

<style scoped>
</style>
