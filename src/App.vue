<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
</script>
<template>
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                <Sidebar/>
            </div>
            <div class="col py-3">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
