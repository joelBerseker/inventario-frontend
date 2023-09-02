<template>
  <div class="position-fixed top-0 end-0 p-3" style="z-index: 5000">
    <div id="myToastEl" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
      <div :class="'toast-header my-c1 ' + styleHeader">
        <strong class="me-auto"><i :class="'bi-hover-bold ' + icon"></i> {{ title }}</strong>

        <button type="button" class="btn btn-toast" data-bs-dismiss="toast" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="toast-body">
        {{ message }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.btn-toast {
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: var(--my-c1) !important;
}
.bi-hover-bold {
  -webkit-text-stroke: 0.03rem;
}
.btn-toast:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
<script>
import { Toast } from "bootstrap";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MyToast",
  data() {
    return {
      title: undefined,
      message: undefined,
      styleHeader: undefined,
      icon: undefined,
    };
  },
  methods: {
    styleheader(key) {
      var resp = "";
      switch (key) {
        case 1:
          resp = "bg-success";
          break;
        case 2:
          resp = "bg-danger";
          break;

        default:
          break;
      }
      return resp;
    },
    iconType(key) {
      var resp = "";
      switch (key) {
        case 1:
          resp = "bi bi-check-lg";
          break;
        case 2:
          resp = "bi bi-exclamation-circle";
          break;

        default:
          break;
      }
      return resp;
    },
    show(opts = {}) {
      this.title = opts.title;
      this.message = opts.message;
      this.styleHeader = this.styleheader(opts.type);
      this.icon = this.iconType(opts.type);

      var myToastEl = document.getElementById("myToastEl");
      var myToast = Toast.getOrCreateInstance(myToastEl);
      myToast.show();
    },
    /*closeToast() {
            var myToastEl = document.getElementById('myToastEl')
            var myToast = Toast.getOrCreateInstance(myToastEl)
            myToast.show();
        },*/
    openToast() {},
  },
});
</script>
