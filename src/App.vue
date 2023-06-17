<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import Sidebar from './components/Sidebar.vue'
</script>
<template>
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-auto col-md-3 col-xl-2 p-0 color-sidebar">
                <Sidebar/>
            </div>
            <div class="col p-4">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style>
.color-sidebar{
    background-color: var(--my-2th-color);
}
</style>
