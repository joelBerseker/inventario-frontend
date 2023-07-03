<template> 
    <div class="bg-color-2 icon" :style="'width: '+size+'; height: '+size">
            <div class="fig-0">
                <div class=" bg-color-4 fig-1"></div>
                <div class=" bg-color-4 fig-2"></div>
                <div class=" bg-color-2 fig-3">
                    <div class=" bg-color-4 fig-3-1"></div>
                </div>

                <div class=" bg-color-1 fig-4"></div>
                <div class=" bg-color-1 fig-5"></div>
                <div class=" bg-color-4 fig-6"></div>
            </div>

        </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({

    props: [
        "size"
    ],
})
</script>

<style scoped>
.icon {

    position: relative;
    overflow: hidden;
    border-radius: 5%;
}

.fig-0 {
    width: 90%;
    height: 90%;
    position: absolute;
    bottom: 15%;
    left: 8%;


    transform: rotate(-25deg);
}

.fig-1 {

    width: 8%;
    height: 85%;
    position: absolute;
    bottom: 5%;
    left: 25%;
    border-radius: 100rem;

}

.fig-2 {

    width: 50%;
    height: 8%;
    position: absolute;
    bottom: 5%;
    left: 25%;
    border-radius: 100rem;
}

.fig-6 {

    width: 15%;
    height: 8%;
    position: absolute;
    top: 10%;
    left: 16%;
    border-radius: 100rem;
}

.fig-3 {
    width: 20%;
    height: 20%;
    position: absolute;
    bottom: -5%;
    left: 15%;
    border-radius: 100px;
    padding: 2%;

}

.fig-3-1 {
    width: 100%;
    height: 100%;

    border-radius: 100px;
}

.fig-4 {
    width: 35%;
    height: 35%;
    position: absolute;
    bottom: 15%;
    left: 35%;
    border-radius: 13%;
}

.fig-5 {
    width: 30%;
    height: 30%;
    position: absolute;
    bottom: 52%;
    left: 35%;
    border-radius: 13%;
}

</style>