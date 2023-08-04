<template>
    <div class="form-group">
        <label for="nombre" v-if="name!=null" class="text-secondary">{{name}}:</label>
        <slot></slot>
        <div v-if="message=='*No requerido'">
            <span class="message">{{ message }}</span>
        </div>
        <div v-else-if="message!=''">
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
    name: 'MyForm',
    props: [
        "name", "message"
    ],
    methods: {
    },
});
</script>