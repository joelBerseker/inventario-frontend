<template>
  <div class="d-flex justify-content-center">
    <div v-if="speed" class="icon" :style="'width: calc(' + size + '/2) ; height: ' + size">
      <div class="fig-7">
        <div :class="color + 'fig-8'"></div>
        <div :class="color + 'fig-9'"></div>
        <div :class="color + 'fig-10'"></div>
      </div>
    </div>
    <div class="icon" :style="'width: ' + size + '; height: ' + size">
      <div class="fig-0">
        <div :class="color + 'fig-1'"></div>
        <div :class="color + 'fig-2'"></div>

        <div :class="color + 'fig-3'"></div>

        <div :class="color + 'fig-4'"></div>
        <div :class="color + 'fig-5'"></div>
        <div :class="color + 'fig-6'"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: ["size", "speed", "mode"],
  computed: {
    color: function () {
      var resp = "";
      switch (this.mode) {
        case 1:
          resp = " my-bg1 ";
          break;
        case 2:
          resp = " my-bg2 ";
          break;
        case 3:
          resp = " my-bg3 ";
          break;
        case 6:
          resp = " my-bg6 ";
          break;
        default:
          resp = " my-bg1 ";
          break;
      }
      return resp;
    },
  },
});
</script>

<style>
@keyframes line-1 {
  0% {
    width: 100%;
  }

  50% {
    width: 50%;
  }

  100% {
    width: 100%;
  }
}

@keyframes line-2 {
  0% {
    width: 50%;
  }

  50% {
    width: 100%;
  }

  100% {
    width: 50%;
  }
}

:root {
  --fig-lines-width: 8%;
  --fig-space: 4%;
  --fig-box: 31%;

  --fig-floor: 5%;
  --fig-back: 25%;
  --fig-wheel: 18%;
}

.fig-7 {
  width: 100%;
  height: 100%;
}

.fig-8 {
  width: 100%;
  height: var(--fig-lines-width);
  position: absolute;
  right: 0%;
  top: 20%;
  border-radius: 100rem;

  animation-name: line-1;
  animation-duration: 0.7s;
  animation-iteration-count: infinite;
}

.fig-9 {
  width: 25%;
  height: var(--fig-lines-width);
  position: absolute;
  right: 0%;
  top: 46%;
  border-radius: 100rem;

  animation-name: line-2;
  animation-duration: 0.7s;
  animation-iteration-count: infinite;
}

.fig-10 {
  width: 100%;
  height: var(--fig-lines-width);
  position: absolute;
  right: 0%;
  bottom: 20%;

  border-radius: 100rem;

  animation-name: line-1;
  animation-duration: 0.7s;
  animation-iteration-count: infinite;
}

.icon {
  position: relative;
  overflow: hidden;
}

.fig-0 {
  width: 90%;
  height: 90%;
  position: absolute;
  bottom: 14%;
  left: 8%;
  transform: rotate(-20deg);
}

.fig-1 {
  width: var(--fig-lines-width);
  height: 85%;
  position: absolute;
  bottom: calc(var(--fig-floor));
  left: var(--fig-back);
  border-radius: 100rem;
}

.fig-2 {
  width: 50%;
  height: var(--fig-lines-width);
  position: absolute;
  bottom: var(--fig-floor);
  left: calc(var(--fig-back));
  border-radius: 100rem;
}

.fig-6 {
  width: 15%;
  height: var(--fig-lines-width);
  position: absolute;
  top: 10%;
  left: 16%;
  border-radius: 100rem;
}

.fig-3 {
  width: var(--fig-wheel);
  height: var(--fig-wheel);
  position: absolute;
  bottom: calc(var(--fig-floor) - (var(--fig-wheel) / 2));
  left: calc(var(--fig-back) - (var(--fig-wheel) / 2));
  border-radius: 100rem;
  padding: var(--fig-space);
}


.fig-4 {
  width: var(--fig-box);
  height: var(--fig-box);
  position: absolute;
  bottom: calc(var(--fig-floor) + var(--fig-lines-width) + var(--fig-space));
  left: calc(var(--fig-back) + var(--fig-lines-width) + var(--fig-space));
  border-radius: 13%;
}

.fig-5 {
  width: var(--fig-box);
  height: var(--fig-box);
  position: absolute;
  bottom: calc(var(--fig-floor) + var(--fig-lines-width) + var(--fig-space) + var(--fig-box) + var(--fig-space));
  left: calc(var(--fig-back) + var(--fig-lines-width) + var(--fig-space));
  border-radius: 13%;
}
</style>
