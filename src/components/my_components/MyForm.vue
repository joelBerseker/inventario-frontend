<template>
    <div class="form-group">
        <label for="nombre">{{name}}:</label>
        <slot></slot>
        <div v-if="message!=''">
            <span class="text-danger message">{{ message }}</span>
        </div>
        
    </div>
</template>
<style scoped>
.message{
    font-size: 0.75rem !important;
}
</style>
<script>
import { defineComponent } from "vue";
export default defineComponent({
    name: 'MyModal',
    props: [
        "name", "message"
    ],
    methods: {
    },
});
</script>