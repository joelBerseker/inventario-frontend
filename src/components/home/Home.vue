<template>
    <MainContent :title="'Inicio'" :icon="'bi bi-house'">
        <div class="row">
            <div class="col-6 mb-3" v-for="item in list" :key="item.title" v-on:click="goTo(item.url)">
                <div class="card box" :id="key">

                    <div class="card-body">
                        <p class="title-text"><i :class="item.icon"></i> {{ item.title }}</p>
                        <p class="card-text">{{ item.desc }}</p>
                    </div>
                </div>
            </div>
        </div>
    </MainContent>
</template>
<style scoped>
.box{
    cursor: pointer;
}
.box:hover{
    background-color: rgb(224, 224, 224);
}
</style>
<script>
import MainContent from '@/components/my_components/MainContent.vue'
import { defineComponent } from "vue";
export default defineComponent({
    name: "Home",
    props: [
        "title", "icon"
    ],
    components: {
        MainContent
    },
    data() {
        return {
            list: [
                {
                    title: "Productos",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-box-seam",
                    url: "/product"
                },
                {
                    title: "Clientes",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-people",
                    url: "/supplier"
                },
                {
                    title: "Proveedores",
                    desc: "With supporting text below as a natural lead-in to additional content.",
                    icon: "bi bi-truck",
                    url: "/customer"
                }
            ]
        }
    },
    methods: {
        goTo(url) {
            this.$router.push(url);
        }
    }
});
</script>