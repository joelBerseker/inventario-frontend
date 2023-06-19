<template>
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 10">
        <div id="myToastEl" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" >
            <div class="toast-header">
                <strong class="me-auto">{{title}}</strong>
                <small>11 mins ago</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                {{message}}
            </div>
        </div>
    </div>
</template>
<style ></style>
<script>
import { Toast } from "bootstrap";
import { defineComponent } from "vue";
export default defineComponent({
    name: 'MyToast',
    data() {
        return {
            title: undefined,
            message: undefined,
        };
    },
    methods: {
        show(opts = {}) {
            this.title = opts.title
            this.message = opts.message

            var myToastEl = document.getElementById('myToastEl')
            var myToast = Toast.getOrCreateInstance(myToastEl)
            myToast.show();
        },
        /*closeToast() {
            var myToastEl = document.getElementById('myToastEl')
            var myToast = Toast.getOrCreateInstance(myToastEl)
            myToast.show();
        },*/
        openToast() {
            
        },

    },
});
</script>