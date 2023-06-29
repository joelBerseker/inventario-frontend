<template>
    <div class="dropdown">
        <button class="form-select form-select-sm" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
            aria-expanded="false" v-on:click="focusSearch()">
            {{ selected }}
        </button>
        <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
            <li class="px-2 mb-1"> <input class="form-control form-control-sm" ref="search" id="inventario" name="inventario"
                    v-model="search" required /> </li>

            <li v-for="(item, index) in list" :key="index">
                <div class="dropdown-item" v-on:click="selectItem(item)">{{ item }}</div>
            </li>
        </ul>
    </div>
</template>
<style ></style>
<script>
import { defineComponent } from "vue";
export default defineComponent({
    name: 'SelectSearch',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: [
        "list",
    ],
    data() {
        return {
            selected: "s",
            search: ""
        };
    },

    methods: {
        focusSearch(){
            this.$refs.search.focus();
        },
        selectItem(_item) {
            this.selected = _item;
            this.itemLocal = _item;
        }
    },
    computed: {
        itemLocal: {
            get: function () {
                return this.modelValue;
            },
            set: function (value) {
                this.$emit('update:modelValue', value)
            }
        },
    },
});
</script>