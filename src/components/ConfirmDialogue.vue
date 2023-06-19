<template>
    <MyModal ref="myModal" :id="'confirmDialogue'">
        <div class="modal-header">
            <p class="modal-title" id="exampleModalLabel">{{ title }}</p>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">

            <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
            <button v-on:click="_cancel" type="button" class="btn btn-secondary btn-sm button-margin">
                <i class="bi bi-x-circle"></i>
                Cancelar
            </button>
            <button v-on:click="_confirm" type="button" class="btn btn-dark btn-sm button-margin">
                <i class="bi bi-check-circle"></i>
                {{ okButton }}
            </button>
        </div>
    </MyModal>
    <!---<div class="modal fade" id="confirmDialogue">
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header">
                    <p class="modal-title" id="exampleModalLabel">{{title}}</p>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                <p>{{ message }}</p>
                </div>
                <div class="modal-footer">
                    <button v-on:click="_cancel" type="button" class="btn btn-secondary btn-sm button-margin">
                        <i class="bi bi-x-circle"></i>
                        Cancelar
                    </button>
                    <button v-on:click="_confirm" type="button" class="btn btn-dark btn-sm button-margin">
                        <i class="bi bi-check-circle"></i>
                        {{okButton}}
                    </button>
                </div>
            </div>
        </div>
    </div>-->
</template>
<style >
.button-margin {
    margin-left: 0.25rem;
    margin-right: 0 !important;
    margin-top: 0;
    margin-bottom: 0;
}
</style>
<script>
import { Modal } from "bootstrap";
import { defineComponent } from "vue";
import MyModal from '@/components/MyModal.vue'

export default defineComponent({
    name: 'ConfirmDialogue',
    components: {
        MyModal
    },
    data() {
        return {
            title: undefined,
            message: undefined,
            okButton: undefined,
            resolvePromise: undefined,
            rejectPromise: undefined,
        };
    },
    methods: {
        show(opts = {}) {
            this.title = opts.title
            this.message = opts.message
            this.okButton = opts.okButton

            this.openModal()
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        _confirm() {
            this.closeModal()
            this.resolvePromise(true)
        },

        _cancel() {
            this.closeModal()
            this.resolvePromise(false)
            // Or you can throw an error
            // this.rejectPromise(new Error('User canceled the dialogue'))
        },

        closeModal() {
            this.$refs.myModal.closeModal();
        },
        openModal() {
            this.$refs.myModal.openModal();
        },

    },
});
</script>