<script>
import { defineComponent } from "vue";
export default defineComponent({
    name: "MainContent",
    props: [
        "title", "icon", "breadcrumb"
    ],
});
</script>
<template>
    <div class="bg-color-3 py-3 px-3 color-1 content">
        <transition name="slide-fade" mode="out-in">

            <p :key="title" class="title-text "><i :class=icon></i> {{ title }}</p>
        </transition>
        <div class="row mt-2">
            <div class="col-auto breadcrumb-item">
                <span v-if="breadcrumb.length > 1"><i class="bi bi-arrow-left-circle"></i>
                    <RouterLink :to="breadcrumb[breadcrumb.length - 2].link" class="color-1"> Atras</RouterLink>
                </span>
                <span v-else class="active"><i class="bi bi-arrow-left-circle"></i> Atras</span>
            </div>
            <div class="col">
                <transition name="slide-fade" mode="out-in">
                    <nav :key="title" aria-label="breadcrumb" class="color-1 margin-breadcrumb">
                        <ol class="breadcrumb mb-0  breadcrumb-ol">

                            <li v-for="(item, index) in breadcrumb" :key="item.name" class="breadcrumb-item">
                                <RouterLink v-if="index <= breadcrumb.length - 2" :to="item.link" class="color-1">{{
                                    item.name }}
                                </RouterLink>
                                <span class="active" v-else>{{ item.name }}</span>

                            </li>
                        </ol>
                    </nav>
                </transition>
            </div>

        </div>




    </div>

    <div class="p-3">
        <slot></slot>
    </div>
</template>
<style scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-enter {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.slide-fade-enter-from

/* .slide-fade-leave-active below version 2.1.8 */
    {
    transform: translateX(-10px);
    opacity: 0;
}

.breadcrumb-ol {
    --bs-breadcrumb-divider-color: var(--my-1th-color);
}

.content {
    transition: 0.5s;

}

.breadcrumb a {
    color: var(--my-1th-color);
}

.margin-breadcrumb {
    margin-left: 1.5rem;
}

.breadcrumb .active {
    color: rgba(255, 255, 255, 0.527);
}

.active {
    color: rgba(255, 255, 255, 0.527) !important;
}
</style>
