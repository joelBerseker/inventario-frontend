<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import Sidebar from './components/home/Sidebar.vue'
</script>
<template>
    <div>
        <div id="sidebar">
            <Sidebar />
        </div>
        <div id="content">
            <RouterView />
        </div>
    </div>
</template>

<style>
.color-sidebar {}

#sidebar {
    overflow: hidden;
    height: 100%;
    /* 100% Full-height */
    width: 250px;
    /* 0 width - change this with JavaScript */
    position: fixed;
    /* Stay in place */
    z-index: 100;
    /* Stay on top */
    top: 0;
    /* Stay at the top */
    left: 0;
    background-color: var(--my-2th-color);
}

#content {
    transition: margin-left 0.5s;
    margin-left: 250px;

    min-height: 100vh;
    background-size: cover;
}
</style>
