<template>
    <transition name="slide-fade-1" mode="out-in">
        <div :key="loading">
            <div v-if="loading">
                <div class="mx-auto center justify-content-center">
                    <div class="container">
                        <div class="row justify-content-md-center" align-h="center">
                            <Icon size="70px" :speed="true" :mode="2" :bgMode="1"></Icon>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!loading">

                <slot>
                </slot>

            </div>
        </div>
    </transition>
</template>
<script>
import { defineComponent } from "vue";
import Icon from '@/components/my_components/Icon.vue'

export default defineComponent({
    name: "Content",
    data() {
        return {

        }
    },
    props: ["loading"],
    components: {
        Icon
    },
    methods: {
    }
}
)
</script>
<style scoped>
.center {
    height: 100%;
    height: 70vh;
    display: flex;
    align-items: center;
    margin: 0;
    overflow-x: hidden;
    overflow-y: hidden;

    min-height: 100%;
}

.slide-fade-1-enter-active {
    transition: all 0.25s ease;
}

.slide-fade-1-enter {
    transition: all 0.25s ease;
}

.slide-fade-1-leave-active {
    transition: all 0.25s ease;
}

.slide-fade-1-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.slide-fade-1-enter-from

/* .slide-fade-1-leave-active below version 2.1.8 */
    {
    transform: translateX(-10px);
    opacity: 0;
}
</style>