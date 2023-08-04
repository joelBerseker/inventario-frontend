<template>
    <div class="dropdown">
        <MyForm class="mb-3" :name="name" :message="validation.validationMessage">
            <textarea v-if="type == 'textarea'" :class="inputClass+' form-control form-control-sm ' + validation.validationStyle"
                :id="name" v-model="itemLocal"></textarea>

            <input v-else :type="type" v-model="itemLocal"
            :class="inputClass+ ' form-control form-control-sm ' + validation.validationStyle" :id="name" @input="$emit('input', $event.target.value)" />


        </MyForm>
    </div>
</template>
  
<script>
import { defineComponent } from "vue";
import MyForm from "@/components/my_components/MyForm.vue";

export default defineComponent({
    name: "MyInput",
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    props: ["modelValue", "name", "validation", "type", "inputClass"],
    data() {
        return {

        };
    },
    components: {
        MyForm
    },
    methods: {

    },
    computed: {
        itemLocal: {
            get: function () {
                return this.modelValue;
            },
            set: function (value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    async created() {
        //await this.getData();
    },
});
</script>
<style>
.disabled-item {
    color: rgba(0, 0, 0, 0.493);
}

.single-line {
    width: 100%;
    /*text-overflow: ellipsis;*/
    overflow: hidden;
    white-space: pre;
}

.item-select {
    white-space: normal !important;
    cursor: pointer;
}
</style>