<script>
import { defineComponent } from "vue";
export default defineComponent({
    name: "MainContent",
    props: [
        "title", "icon"
    ],
});
</script>
<template>
    <div class="bg-secondary py-3 px-3 color-1">
        <p class="title-text "><i :class=icon></i> {{title}}</p>
    </div>
    <div class="p-3">
        <slot></slot>
    </div>
</template>
