<template>
  <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title" size="modal-xl" v-on:mymodal:close="closeModal">
    <div class="modal-body">
      <div class="row">
        <div class="col-3 head pe-3">
          <MyInput
            class="mb-3"
            type="text"
            name="Numero de item"
            :validation="validation.header.order_code"
            v-model="itemCopy.header.order_code"
            :disabled="disabled"
            v-on:input="inputCode()"
          />
          <SelectSearch
            class="mb-3"
            v-model="itemCopy.header.provider"
            link="providers/providers/"
            name="Proveedor"
            :validation="validation.header.provider"
            id="Proveedor"
            :disabled="disabled"
            v-on:update="inputProvider()"
          />
          <MyInput
            type="textarea"
            name="Descripción"
            :validation="validation.header.detail"
            v-model="itemCopy.header.detail"
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
              <button type="button" class="btn btn-primary btn-sm me-1">
                <i class="bi bi-plus-lg"></i> Agregar Producto
              </button>
              <button
                :disabled="
                  disabledAllButtonList ||
                  (mode != 1 && this.backupList.length > 0 && this.backupList[0].id == undefined)
                "
                type="button"
                class="btn btn-sm btn-primary"
                @click="listItemAdd()"
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
                v-model="itemCopy.header.total_price"
                :disabled="true"
                :viewMode="disabled"
                ><template v-slot:pre>S/.</template>
              </MyInput>
            </div>
          </div>

          <ListContent ref="tableContent" :loading="this.loadingContentList" :size="itemCopy.detail.length">
            <table class="my-table w-100">
              <tr>
                <th style="width: 20%">Nombre</th>
                <th class="text-end" style="width: 20%">Cantidad</th>
                <th class="text-end" style="width: 20%">Precio de compra</th>
                <th class="text-end" style="width: 20%">Precio de venta</th>
                <th class="text-end" style="width: 20%">Subtotal</th>
                <th v-if="mode != 2"></th>
              </tr>

              <tr v-for="(item, index) in itemCopy.detail" :key="index" class="detalle-item">
                <td>
                  <SelectSearch
                    v-model="selectedProducts[index]"
                    link="products/products/"
                    :validation="validation.detail[index].product"
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
                    :validation="validation.detail[index].quantity"
                    v-model="item.stock"
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
                    :validation="validation.detail[index].purchase_price"
                    v-model="item.purchase_price"
                    v-on:input="inputPurchacePrice(index)"
                    :disabled="disabledItemList[index] && mode != 1"
                    :viewMode="disabled"
                    ><template v-slot:pre>S/.</template>
                  </MyInput>
                  <label class="secondary-text">
                    <i class="bi bi-arrow-return-right"></i> Ant. S/.{{ item.last_purchase_price }}
                  </label>
                </td>
                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    :validation="validation.detail[index].sale_price"
                    v-model="item.sale_price"
                    v-on:input="inputSalePrice(index)"
                    :disabled="disabledItemList[index] && mode != 1"
                    :viewMode="disabled"
                    ><template v-slot:pre>S/.</template>
                  </MyInput>
                  <label class="secondary-text">
                    <i class="bi bi-arrow-return-right"></i> Ant. S/.{{ item.last_sale_price }}
                  </label>
                </td>
                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    v-model="item.subtotal"
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
import ConectionInput from "@/mixin/conections/ConectionInput";
import ConectionInputDetail from "@/mixin/conections/ConectionInputDetail";
import ListContent from "@/components/my_other_components/ListContent.vue";
export default defineComponent({
  props: ["itemSelected"],
  mixins: [ValidationFunctions, UtilityFunctions, ConectionInput, ConectionInputDetail],
  inject: ["confirmDialogue", "showToast"],
  components: {
    MyModal,
    MyForm,
    SelectSearch,
    MyInput,
    MySelect,
    ListContent,
  },
  name: "DetailInput",
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      validation: {
        header: {
          order_code: {},
          provider: {},
          detail: {},
        },
        detail: [],
      },
      itemCopy: {
        header: {
          detail: null,
          order_code: null,
          provider: null,
          total_price: null,
        },
        detail: [],
      },
      selectedProducts: [],
      disabledItemList: [],
      backupList: [],
      loadingContentList: false,
      disabledAllButtonList: false,
    };
  },
  watch: {
    itemSelected() {
      this.resetItemCopy();
    },
    "itemCopy.detail": {
      handler: function () {
        var total = 0;
        this.itemCopy.detail.forEach((element) => {
          total += element.subtotal * 1;
        });
        if (typeof total == "number") {
          this.itemCopy.header.total_price = total.toFixed(2);
        }
      },
      deep: true,
    },
  },
  methods: {
    resetItemCopy() {
      this.itemCopy.header = JSON.parse(JSON.stringify(this.itemSelected));
      if (this.mode != 1) {
        this.itemCopy.header.provider = {
          name: this.itemSelected.provider_name,
          id: this.itemSelected.id_provider,
        };
        this.getInputDetails(this.itemSelected.id);
      } else {
        this.listReset();
        this.listItemAdd();
      }
    },
    getInputDetails(id) {
      this.loadingContentList = true;
      this.listReset();
      this.getInputDetailRegisters(id).then((response) => {
        if (response.success) {
          response.response.data.results.forEach((element) => {
            this.listItemAdd(element);
          });
          this.loadingContentList = false;
        }
      });
    },
    resetValidation() {
      this.validation.header = {
        order_code: {},
        provider: {},
        detail: {},
      };
      for (let i = 0; i < this.validation.detail.length; i++) {
        this.validation.detail[i] = {
          product: {},
          quantity: {},
        };
      }
    },
    validateForm() {
      this.validateCode();
      this.validateProvider();
      this.validateDescription();
      var _validateDetail = this.validateDetail();

      var result =
        this.validation.header.order_code.isValid &&
        this.validation.header.provider.isValid &&
        this.validation.header.detail.isValid &&
        _validateDetail;
      return result;
    },

    validateCode() {
      this.validation.header.order_code = this.validationRequiredText(this.itemCopy.header.order_code, 3, 50);
    },
    validateProvider() {
      this.validation.header.provider = this.validationRequiredSelect(this.itemCopy.header.provider);
    },
    validateDescription() {
      this.validation.header.detail = this.validationNoRequiredText(this.itemCopy.header.detail, 3, 50);
    },
    validateProduct(index) {
      this.validation.detail[index].product = this.validationRequiredSelect(this.itemCopy.detail[index].id);
    },
    validateQuantity(index) {
      this.validation.detail[index].quantity = this.validationRequiredNumber(this.itemCopy.detail[index].stock);
    },
    validatePurchasePrice(index) {
      this.validation.detail[index].purchase_price = this.validationRequiredNumber(
        this.itemCopy.detail[index].purchase_price
      );
    },
    validateSalePrice(index) {
      this.validation.detail[index].sale_price = this.validationRequiredNumber(this.itemCopy.detail[index].sale_price);
    },
    validateDetail() {
      var resp = true;
      for (var i = 0; i < this.validation.detail.length; i++) {
        if (!this.validateDetailRow(i)) {
          resp = false;
        }
      }
      return resp;
    },
    validateDetailRow(index) {
      this.validateProduct(index);
      this.validateQuantity(index);
      this.validatePurchasePrice(index);
      this.validateSalePrice(index);
      var result =
        this.validation.detail[index].product.isValid &&
        this.validation.detail[index].quantity.isValid &&
        this.validation.detail[index].purchase_price.isValid &&
        this.validation.detail[index].sale_price.isValid;
      return result;
    },

    inputCode() {
      this.validateCode();
    },
    inputProvider() {
      this.validateProvider();
    },
    inputDescription() {
      this.validateDescription();
    },
    inputProduct(index) {
      this.listItemChangeFromSelect(index, this.selectedProducts[index]);
      this.calculateQuatity(index);
      this.validateProduct(index);
    },
    inputQuantity(index) {
      this.validateQuantity(index);
      this.calculateQuatity(index);
    },
    inputPurchacePrice(index) {
      this.validatePurchasePrice(index);
      this.calculateQuatity(index);
    },
    inputSalePrice(index) {
      this.validateSalePrice(index);
    },
    calculateQuatity(index) {
      this.itemCopy.detail[index].subtotal = (
        this.itemCopy.detail[index].purchase_price * this.itemCopy.detail[index].stock
      ).toFixed(2);
    },
    listItemIsEditing() {
      var resp = false;
      for (let i = 0; i < this.disabledItemList.length; i++) {
        if (this.disabledItemList[i] == false) {
          resp = true;
          break;
        }
      }
      return resp;
    },
    listItemAdd(item = null) {
      if (item == null) {
        this.selectedProducts.unshift(null);
        this.itemCopy.detail.unshift({
          id: undefined,
          stock: 1,
          purchase_price: 0,
          sale_price: 0,
          subtotal: 0,
        });
        this.backupList.unshift({
          id: undefined,
          stock: 1,
          purchase_price: 0,
          sale_price: 0,
          subtotal: 0,
          product: null,
        });
      } else {
        this.selectedProducts.unshift({ name: item.product_name });
        this.itemCopy.detail.unshift({
          id: item.id_product,
          purchase_price: item.purchase_price,
          sale_price: item.sale_price,
          stock: item.quantity,
          subtotal: (item.purchase_price * item.quantity).toFixed(2),
        });
        this.backupList.unshift(item);
        console.log(item);
      }
      this.validation.detail.unshift({
        product: {},
        quantity: {},
        purchase_price: {},
        sale_price: {},
      });
      this.disabledItemList.unshift(true);
    },
    buttonListDelete(index) {
      if (this.mode == 1 || this.backupList[index].id == undefined) {
        this.listDelete(index);
      } else {
        this.confirmDeleteInputDetailRegister(this.backupList[index].id).then((response) => {
          if (response.success) {
            this.getInputDetails(this.itemSelected.id);
          }
        });
      }
    },
    listDelete(index) {
      this.itemCopy.detail.splice(index, 1);
      this.validation.detail.splice(index, 1);
      this.selectedProducts.splice(index, 1);
      this.disabledItemList.splice(index, 1);
      this.backupList.splice(index, 1);
    },
    buttonListSave(index) {
      if (this.validateDetailRow(index)) {
        var item = {
          id: this.backupList[index].id,
          id_purchase: this.itemSelected.id,
          id_product: this.itemCopy.detail[index].id,
          purchase_price: this.itemCopy.detail[index].purchase_price,
          sale_price: this.itemCopy.detail[index].sale_price,
          quantity: this.itemCopy.detail[index].stock,
        };
        if (this.backupList[index].id == undefined) {
          //agregado recientemente
          this.addInputDetailRegister(item).then((response) => {
            if (response.success) {
              this.disabledAllButtonList = false;
              this.getInputDetails(this.itemSelected.id);
            }
          });
        } else {
          //editado
          this.editInputDetailRegister(item).then((response) => {
            if (response.success) {
              this.disabledAllButtonList = false;
              this.getInputDetails(this.itemSelected.id);
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
      this.validation.detail[index] = {
        product: {},
        quantity: {},
      };
      var item = this.backupList[index];
      this.selectedProducts[index] = { name: item.product_name };
      this.itemCopy.detail[index] = {
        id: item.id_product,
        sale_price: item.new_sale_price,
        stock: item.quantity,
        subtotal: (item.new_sale_price * item.quantity).toFixed(2),
      };
    },
    listReset() {
      this.itemCopy.detail = [];
      this.validation.detail = [];
      this.selectedProducts = [];
      this.disabledItemList = [];
      this.backupList = [];
    },
    listDeleteNull() {
      for (let i = this.backupList.length - 1; i >= 0; i--) {
        if (this.backupList[i].id == undefined) {
          console.log(this.backupList[i]);
          this.listDelete(i);
        }
      }
    },
    listItemChangeFromSelect(index, data) {
      this.itemCopy.detail[index].id = data.id;
      this.itemCopy.detail[index].sale_price = data.price;
      this.itemCopy.detail[index].purchase_price = data.cost;
      this.itemCopy.detail[index].last_sale_price = data.price;
      this.itemCopy.detail[index].last_purchase_price = data.cost;
    },
    async buttonSave() {
      if (this.validateForm()) {
        if (this.itemCopy.detail.length > 0) {
          switch (this.mode) {
            case 1:
              this.addInputRegister(this.itemCopy.header).then((response) => {
                var id_order = 0;
                if (response.success) {
                  id_order = response.response.data.id;
                  this.addInputDetailRegisters(id_order, this.itemCopy.detail).then((response) => {
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
              this.editInputRegister(this.itemCopy.header).then((response) => {
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
      this.resetItemCopy();
      this.changeMode(2);
    },
    buttonDelete() {
      this.confirmDeleteInputRegister(this.itemCopy.header.id).then((response) => {
        if (response.success) {
          this.$emit("item:delete");
          this.closeModal();
        }
      });
    },
    changeMode(mode) {
      this.mode = mode;
      this.disabledAllButtonList = false;
      this.resetValidation();
      switch (this.mode) {
        case 1:
          this.title = "Agregar Entrada";
          this.disabled = false;
          break;
        case 2:
          this.title = "Visualizar Entrada";
          this.disabled = true;
          break;
        case 3:
          this.title = "Editar Entrada";
          this.disabled = false;
          break;
        default:
          this.title = "Error";
          break;
      }
    },
    closeModal() {
      this.listDeleteNull();
      try {
        this.$refs.myModal.closeModal();
      } catch (error) {}
    },
    openModal() {
      this.$refs.myModal.openModal();
    },
  },
  async created() {},
});
</script>
