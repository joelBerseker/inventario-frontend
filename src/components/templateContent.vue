<script>
import SystemContent from '@/components/system/SystemContent.vue'
import { defineComponent } from "vue";

export default defineComponent({
    name: "templateContent",
    props: ["changeTopbar"],
    components: {
        SystemContent,
    },
    data() {
        return {
            loadingContentSystem: false,
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
    },
    async created() {
        this.changeTopbar(this.topbar);
    },
});
</script>
<template>
    <SystemContent ref="content" :loading="loadingContentSystem">
        here information
    </SystemContent>
</template>

<style scoped>
</style>
