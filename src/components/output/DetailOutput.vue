<template>
  <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title" size="modal-xl" v-on:mymodal:close="closeModal">
    <div class="modal-body">
      <div class="row">
        <div class="col-3 head pe-3">
          <MyInput
            class="mb-3"
            type="text"
            name="Numero de item"
            :validation="item.header.order_code.validation"
            v-model="item.header.order_code.value"
            :disabled="disabled"
            v-on:input="inputCode()"
          />
          <SelectSearch
            class="mb-3"
            v-model="item.header.client.value"
            link="clients/clients/"
            name="Cliente"
            :validation="item.header.client.validation"
            id="cliente"
            :disabled="disabled"
            v-on:update="inputClient()"
          />
          <MySelect
            class="mb-3"
            name="Tipo de pago"
            id="Tipo de pago"
            :options="optionsPaymentType"
            :validation="item.header.payment_type.validation"
            v-model="item.header.payment_type.value"
            :disabled="disabled"
            v-on:update="inputPaymentType()"
          />
          <MyInput
            type="textarea"
            name="Descripción"
            :validation="item.header.description.validation"
            v-model="item.header.description.value"
            :disabled="disabled"
            v-on:input="inputDescription()"
          />
        </div>

        <div class="col-9 ps-3">
          <div class="row mb-3 d-flex align-items-end">
            <div class="col">
              <p class="title-text">Lista de Productos</p>
            </div>
            <div v-if="mode != 2" class="col text-end">
              <button
                :disabled="
                  disabledAllButtonList ||
                  (mode != 1 && this.backupList.length > 0 && this.backupList[0].id == undefined)
                "
                type="button"
                class="btn btn-sm btn-primary"
                @click="listAdd()"
              >
                <i class="bi bi-arrow-90deg-down"></i> Agregar Fila
              </button>
            </div>
            <div class="col-2">
              <MyInput
                name="Total"
                type="number"
                viewClass="text-end"
                inputClass="text-end"
                labelClass="text-end"
                v-model="item.header.total_price.value"
                :disabled="true"
                :viewMode="disabled"
                ><template v-slot:pre>S/.</template>
              </MyInput>
            </div>
          </div>

          <ListContent ref="tableContent" :loading="this.loadingContentList" :size="item.detail.length">
            <table class="my-table w-100">
              <tr>
                <th style="width: 40%">Nombre</th>
                <th class="text-end" style="width: 20%">Cantidad</th>
                <th class="text-end" style="width: 20%">Precio de venta</th>
                <th class="text-end" style="width: 20%">Subtotal</th>
                <th v-if="mode != 2"></th>
              </tr>

              <tr v-for="(row, index) in item.detail" :key="index" class="detalle-item">
                <td>
                  <SelectSearch
                    v-model="row.product.value"
                    link="products/products/"
                    :validation="row.product.validation"
                    v-on:update:modelValue="inputProduct(index)"
                    :id="index + 'product'"
                    :disabled="disabledItemList[index] && mode != 1"
                    :viewMode="disabled"
                  >
                  </SelectSearch>
                </td>

                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    :validation="row.quantity.validation"
                    v-model="row.quantity.value"
                    v-on:input="inputQuantity(index)"
                    :disabled="disabledItemList[index] && mode != 1"
                    :viewMode="disabled"
                  />
                </td>
                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    v-model="row.new_sale_price.value"
                    :disabled="true"
                    :viewMode="disabled"
                    ><template v-slot:pre>S/.</template>
                  </MyInput>
                </td>
                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    v-model="row.subtotal.value"
                    :disabled="true"
                    :viewMode="disabled"
                    ><template v-slot:pre>S/.</template>
                  </MyInput>
                </td>

                <td v-if="!disabled">
                  <div class="d-flex">
                    <button
                      v-if="disabledItemList[index] && mode != 1"
                      :disabled="disabledAllButtonList"
                      type="button"
                      class="btn btn-sm btn-primary me-1"
                      @click="buttonListEdit(index)"
                    >
                      <i class="bi bi-pen"></i>
                    </button>
                    <button
                      v-if="!disabledItemList[index]"
                      type="button"
                      class="btn btn-sm btn-secondary me-1"
                      @click="buttonListCancel(index)"
                    >
                      <i class="bi bi-arrow-left"></i>
                    </button>
                    <button
                      v-if="!disabledItemList[index]"
                      type="button"
                      class="btn btn-sm btn-primary me-1"
                      @click="buttonListSave(index)"
                    >
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button
                      v-if="disabledItemList[index]"
                      :disabled="disabledAllButtonList"
                      type="button"
                      class="btn btn-sm btn-danger"
                      @click="buttonListDelete(index)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </table>
          </ListContent>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" @click="buttonDelete" class="btn btn-danger btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-trash"></i>
        Eliminar
      </button>
      <button type="button" @click="buttonEdit" class="btn btn-primary btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-pen"></i>
        Editar
      </button>
      <button type="button" @click="buttonCancel" class="btn btn-secondary btn-sm button-margin" v-if="mode == 3">
        <i class="bi bi-arrow-left"></i>
        Cancelar
      </button>
      <button type="button" @click="buttonSave" class="btn btn-primary btn-sm button-margin" v-if="mode != 2">
        <i class="bi bi-check-lg"></i>
        Guardar
      </button>
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
.transparent {
  color: transparent !important;
}
.head {
  border-right: 1px solid rgba(0, 0, 0, 0.171);
}
</style>
<script>
import { defineComponent } from "vue";
import MyModal from "@/components/my_components/MyModal.vue";
import MyForm from "@/components/my_components/MyForm.vue";
import MyInput from "@/components/my_components/MyInput.vue";
import MySelect from "@/components/my_components/MySelect.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import UtilityFunctions from "@/mixin/UtilityFunctions.js";
import SelectSearch from "@/components/my_other_components/SelectSearch.vue";
import ConectionOutput from "@/mixin/conections/ConectionOutput";
import ConectionOutputDetail from "@/mixin/conections/ConectionOutputDetail";
import ListContent from "@/components/my_other_components/ListContent.vue";
import { ModelOutput } from "@/mixin/models/ModelOutput";
export default defineComponent({
  mixins: [ValidationFunctions, UtilityFunctions, ConectionOutput, ConectionOutputDetail],
  inject: ["confirmDialogue", "showToast"],
  components: {
    MyModal,
    MyForm,
    SelectSearch,
    MyInput,
    MySelect,
    ListContent,
  },
  name: "DetailOutput",
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      item: new ModelOutput(),
      itemBackup: {},
      selectedProducts: [],
      disabledItemList: [],
      backupList: [],
      loadingContentList: false,
      disabledAllButtonList: false,
    };
  },
  watch: {
    "item.detail": {
      handler: function () {
        var total = 0;
        this.item.detail.forEach((element) => {
          total += element.subtotal.value * 1;
        });
        if (typeof total == "number") {
          this.item.header.total_price.value = total.toFixed(2);
        }
      },
      deep: true,
    },
  },
  methods: {
    getOutputDetails(id) {
      this.loadingContentList = true;
      this.listReset();
      this.getOutputDetailRegisters(id).then((response) => {
        if (response.success) {
          response.response.data.results.forEach((element) => {
            this.listAdd(element);
          });
          this.loadingContentList = false;
        }
      });
    },
    inputCode() {
      this.item.header.validateCode();
    },
    inputClient() {
      this.item.header.validateClient();
    },
    inputPaymentType() {
      this.item.header.validatePaymentType();
    },
    inputDescription() {
      this.item.header.validateDescription();
    },
    inputProduct(index) {
      this.item.detail[index].copyFromProduct();
      this.item.detail[index].calculateSubtotal();
      this.item.detail[index].validateProduct(index);
    },
    inputQuantity(index) {
      this.item.detail[index].calculateSubtotal();
      this.item.detail[index].validateQuantity();
    },
    listAdd(item = null) {
      if (item == null) {
        this.item.detailAdd({});
        this.backupList.unshift({});
      } else {
        this.item.detailAdd(item);
        this.backupList.unshift(item);
      }
      this.disabledItemList.unshift(true);
    },
    listDelete(index) {
      this.item.detailDelete(index);
      this.disabledItemList.splice(index, 1);
      this.backupList.splice(index, 1);
    },
    listReset() {
      this.item.detail = [];
      this.disabledItemList = [];
      this.backupList = [];
    },
    buttonListSave(index) {
      if (this.item.detail[index].validateForm()) {
        if (this.backupList[index].id == undefined) {
          //agregado recientemente
          this.addOutputDetailRegister(this.item.detail[index].getToAddId(this.item.header.id.value)).then(
            (response) => {
              if (response.success) {
                this.disabledAllButtonList = false;
                this.getOutputDetails(this.item.header.id.value);
              }
            }
          );
        } else {
          //editado
          this.editOutputDetailRegister(this.item.detail[index].getToEdit()).then((response) => {
            if (response.success) {
              this.disabledAllButtonList = false;
              this.getOutputDetails(this.item.header.id.value);
            }
          });
        }
      } else {
        this.showToast({
          title: "Ocurrió un error",
          message: "No se agrego ningun producto, revise si todos los campos se llenaron correctamente.",
          type: 2,
        });
      }
    },
    buttonListEdit(index) {
      this.disabledAllButtonList = true;
      this.disabledItemList[index] = false;
    },
    buttonListCancel(index) {
      this.disabledAllButtonList = false;
      this.disabledItemList[index] = true;
      this.item.detail[index].setFromData(this.backupList[index]);
      this.item.detail[index].resetValidation();
    },
    buttonListDelete(index) {
      if (this.mode == 1 || this.backupList[index].id == undefined) {
        this.listDelete(index);
      } else {
        console.log(this.backupList[index].id);
        this.confirmDeleteOutputDetailRegister(this.backupList[index].id).then((response) => {
          if (response.success) {
            this.getOutputDetails(this.item.header.id.value);
          }
        });
      }
    },
    async buttonSave() {
      if (this.item.validateForm()) {
        if (this.item.detail.length > 0) {
          switch (this.mode) {
            case 1:
              this.addOutputRegister(this.item.header.getToAdd()).then((response) => {
                var id_order = 0;
                if (response.success) {
                  id_order = response.response.data.id;
                  this.addOutputDetailRegisters(this.item.getDetailToJSON(id_order)).then((response) => {
                    if (response.success) {
                      this.$emit("item:add");
                      this.closeModal();
                    }
                  });
                } else {
                  id_order = -1;
                }
              });
              break;
            case 3:
              this.editOutputRegister(this.item.header.getToEdit()).then((response) => {
                if (response.success) {
                  this.$emit("item:edit");
                  this.closeModal();
                }
              });
              break;
            default:
              break;
          }
        } else {
          this.showToast({
            title: "Ocurrió un error",
            message: "No se agrego ningun producto, revise si todos los campos se llenaron correctamente.",
            type: 2,
          });
        }
      } else {
        this.showToast({
          title: "Ocurrió un error",
          message: "Datos no válidos, revise si todos los campos se llenaron correctamente.",
          type: 2,
        });
      }
    },
    buttonEdit() {
      this.changeMode(3);
    },
    buttonCancel() {
      this.item.header.setFromData(this.itemBackup);
      this.getOutputDetails(this.item.header.id.value);
      this.changeMode(2);
    },
    buttonDelete() {
      this.confirmDeleteOutputRegister(this.item.header.id.value).then((response) => {
        if (response.success) {
          this.$emit("item:delete");
          this.closeModal();
        }
      });
    },
    changeMode(mode) {
      this.mode = mode;
      this.disabledAllButtonList = false;
      this.item.resetValidation();
      switch (this.mode) {
        case 1:
          this.title = "Agregar Salida";
          this.disabled = false;
          break;
        case 2:
          //this.item.setFromData(this.itemBackup);
          this.title = "Visualizar Salida";
          this.disabled = true;
          break;
        case 3:
          this.title = "Editar Salida";
          this.disabled = false;
          break;
        default:
          this.title = "Error";
          break;
      }
    },
    openAdd() {
      this.changeMode(1);
      this.openModal();
      this.itemBackup = {};
      this.item.header.setFromData({});
      this.listReset();
      this.listAdd({});
    },
    openView(data) {
      this.changeMode(2);
      this.openModal();
      this.itemBackup = JSON.parse(JSON.stringify(data));
      this.item.header.setFromData(data);
      this.getOutputDetails(this.item.header.id.value);
    },
    openViewId(id) {
      this.getOutputRegister(id).then((response) => {
        if (response.success) {
          this.changeMode(2);
          this.openModal();
          this.itemBackup = JSON.parse(JSON.stringify(response.response.data));
          this.item.header.setFromData(response.response.data);
          this.getOutputDetails(this.item.header.id.value);
        }
      });
    },
    closeModal() {
      this.$refs.myModal.closeModal();
    },
    openModal() {
      this.$refs.myModal.openModal();
    },
  },
  async created() {},
});
</script>
