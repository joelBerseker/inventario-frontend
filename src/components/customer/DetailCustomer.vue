<template>
    <MyModal ref="myModal" :id="'supplierDetailModal'" :title="this.title">

        <div class="modal-body">
            <MyForm class="mb-3" name="Nombre">
                <input type="text" class="form-control" id="name" name="name" :disabled="disabled"
                    v-model="item_selected.name" required />
            </MyForm>
            <div class="row">
                <div class="col-4">
                    <MyForm class="mb-3" name="Tipo de documento">
                        <input type="text" :class="'form-control '" id="documentType" name="documentType"
                            :disabled="disabled" v-model="item_selected.documentType" required />
                    </MyForm>
                </div>
                <div class="col">
                    <MyForm class="mb-3" name="Documento">
                        <input type="text" class="form-control" id="document" name="document" :disabled="disabled"
                            v-model="item_selected.document" required />
                    </MyForm>
                </div>
            </div>

            <MyForm class="mb-3" name="Telefono">
                <input type="text" class="form-control" id="phone" name="phone" :disabled="disabled"
                    v-model="item_selected.phone" required />
            </MyForm>
            <MyForm class="mb-3" name="Dirección">
                <input type="text" class="form-control" id="address" name="address" :disabled="disabled"
                    v-model="item_selected.address" required />
            </MyForm>
            <MyForm class="mb-3" name="Correo">
                <input type="text" class="form-control" id="mail" name="mail" :disabled="disabled"
                    v-model="item_selected.mail" required />
            </MyForm>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm button-margin" data-bs-dismiss="modal">
                <i class="bi bi-x-circle"></i> Cerrar
            </button>
            <button type="button" @click="deleteItem(item_selected)" class="btn btn-danger btn-sm button-margin"
                v-if="mode == 2">
                <i class="bi bi-trash"></i>
                Eliminar
            </button>
            <button type="button" @click="editMode" class="btn btn-dark btn-sm button-margin" v-if="mode == 2">
                <i class="bi bi-pen"></i>
                Editar
            </button>
            <button type="button" @click="saveItem" class="btn btn-success btn-sm button-margin" v-if="mode != 2">
                <i class="bi bi-check-circle"></i>
                Guardar
            </button>
            {{ validateForm }}
        </div>
    </MyModal>
</template>
<style scoped>
.button-margin {
    margin-left: 0.25rem;
    margin-right: 0 !important;
    margin-top: 0;
    margin-bottom: 0;
}
</style>
<script>
import axios from "axios";
import { defineComponent } from "vue";
import MyModal from '@/components/my_components/MyModal.vue'
import MyForm from '@/components/my_components/MyForm.vue'
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
    props: [
        "item_selected", "deleteItem", "showToast", "getCustomers"
    ],
    mixins: [ValidationFunctions],
    components: {
        MyModal,
        MyForm,
        MyForm
    },
    name: "DetailCustomer",
    data() {
        return {
            disabled: false,
            mode: 0,
            title: "",
            errorMessage: {},
            validated: false,
        };
    },

    computed: {
        validateForm: function () {
            var result = true;
            return result
        },
        validationCode: function () {
            var text = this.item_selected.code;
            var _message = "";
            var _valid_text = "";
            var _valid = true;
            if (this.showValidation(text, this.validated, this.mode)) {
                _message = this.onlyText(text, _message);
                _message = this.textEmpty(text, _message);
                _message = this.textLength(text, _message, 3, 6);

                _valid_text = (_message != "") ? " is-invalid" : " is-valid";
                _valid = (_message != "") ? false : true;
            }
            var response = { message: _message, validText: _valid_text, valid: _valid }
            return response;
        },


    },
    methods: {
        changeCurrency() {
            this.item_selected.price = this.item_selected.price.replace(/[^0-9]/, '')
            console.log("-------------")

            console.log("value -> " + this.item_selected.price)
            var text = this.item_selected.price.toString().replace(/[^0-9]/, '')
            console.log("lengh -> " + text.length)
            console.log("text -> " + text)
            if (text.length >= 3) {
                var firsPart = text.slice(0, -2);
                var lastPart = text.slice(text.length - 2)
                var complete = firsPart + "." + lastPart
                console.log((complete))
                this.item_selected.price = Number(complete).toFixed(2)
            }

            /*if (this.item_selected.price.toString().length == 3) {
                this.item_selected.price = (this.item_selected.price / 100).toFixed(2)
            } else if (this.item_selected.price.toString().length >= 4) {
                this.item_selected.price = (this.item_selected.price * 1000 / 100).toFixed(2)
            }*/

        },
        async saveItem() {
            this.validated = true;
            if (this.validateForm) {
                var form_data = new FormData();
                for (var key in this.item_selected) {
                    if (this.mode == 3 && (key == 'id' || key == 'created_at' || key == 'updated_at' || key == 'supplier_image')) {
                        console.log("key ->" + key);
                        continue;
                    }
                    form_data.append(key, this.item_selected[key]);
                }
                switch (this.mode) {
                    case 1:
                        this.addItem(form_data);
                        break;
                    case 3:
                        this.editItem(form_data);
                        break;
                    default:
                        break;
                }
            } else {
                this.showToast({
                    title: "Validar Registro",
                    message: "Ocurrió un error, revise todos si todos los campos se llenaron correctamente",
                    type: 2,
                });
            }
        },
        addItem(data) {
            var path = url + `clients/clients/`;
            axios.post(path, data).then((response) => {
                this.showToast({
                    title: "Agregar Registro",
                    message: "Operación exitosa",
                    type: 1,
                });
                this.getCustomers();
                this.closeModal();
            }).catch((error) => {
                console.log(error)
                this.showToast({
                    title: "Agregar Registro",
                    message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                    type: 2,
                });
            });
        },
        editItem(data) {
            console.log(data);
            var path = url + `clients/clients/` + this.item_selected.id + '/';
            axios.put(path, data).then((response) => {
                this.showToast({
                    title: "Agregar Registro",
                    message: "Operación exitosa",
                    type: 1,
                });
                this.getCustomers();
                this.closeModal();
            }).catch(() => {
                this.showToast({
                    title: "Agregar Registro",
                    message: "Ocurrió un error, si continua sucediendo contacte con su proveedor",
                    type: 2,
                });
            });
        },
        changeMode(mode) {
            switch (mode) {
                case 1:
                    this.title = "Agregar Proveedor"
                    this.disabled = false
                    break;
                case 2:
                    this.title = "Visualizar Proveedor"
                    this.disabled = true
                    break;
                case 3:
                    this.title = "Editar Proveedor"
                    this.disabled = false
                    break;
                default:
                    this.title = "Error"
                    break;
            }
            this.mode = mode;
        },
        editMode() {
            this.changeMode(3);
        },
        closeModal() {
            this.$refs.myModal.closeModal();
        },
        openModal() {
            this.validated = false;
            this.$refs.myModal.openModal();
        },
    },
});
</script>
