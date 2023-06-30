<template>
    <div class="dropdown">
        <button class="form-select form-select-sm text-start" type="button" id="dropdownMenuButton1"
            data-bs-toggle="dropdown" aria-expanded="false" v-on:click="focusSearch()">
            {{ itemLocal }}
        </button>
        <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
            <li class="px-2 mb-2">
                <input class="form-control form-control-sm" ref="search" id="search" name="search" v-model="search"
                placeholder="Buscar..." />
            </li>
            <li class="text-center" v-if="listFiltered.length<=0">
                <div>No se encontraron elementos</div>
            </li>
            <li v-for="(item, index) in listFiltered" :key="index">
                <div class="dropdown-item " v-on:click="selectItem(item)">{{ item }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
    name: 'SelectSearch',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: [
        "list", "modelValue"
    ],
    data() {
        return {
            search: ""
        };
    },

    methods: {
        focusSearch() {
            this.$refs.search.focus();
        },
        selectItem(_item) {
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
        listFiltered() {
            return this.list.filter((item) => {
                return item.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
});
</script>