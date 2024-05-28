<template>
  <MyModal
    ref="myModal"
    :id="'productDetailModal1'"
    :title="this.title"
    size="modal-xl"
    v-on:mymodal:close="closeModal"
  >
    <ProductDetail ref="modalProduct" v-on:item:add="onAddProduct" />

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
            v-model="item.header.provider.value"
            link="providers/providers/"
            name="Proveedor"
            :validation="item.header.provider.validation"
            id="Proveedor"
            :disabled="disabled"
            v-on:update="inputProvider()"
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
              <button type="button" class="btn btn-primary btn-sm me-1" @click="addProduct()">
                <i class="bi bi-plus-lg"></i> Agregar Producto
              </button>
              <button
                :disabled="
                  disabledListButtons ||
                  (mode != 1 && this.listBackup.length > 0 && this.item.detail[0].id.value == undefined)
                "
                type="button"
                class="btn btn-sm btn-primary"
                @click="buttonAddRow()"
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
                <th style="width: 20%">Nombre</th>
                <th class="text-end" style="width: 20%">Cantidad</th>
                <th class="text-end" style="width: 20%">Precio de compra</th>
                <th class="text-end" style="width: 20%">Precio de venta</th>
                <th class="text-end" style="width: 20%">Subtotal</th>
                <th v-if="mode != 2"></th>
              </tr>

              <tr v-for="(row, index) in item.detail" :key="index" class="detalle-item">
                <td>
                  <SelectSearch
                    ref="selectProduct"
                    v-model="row.product.value"
                    link="products/products/"
                    :validation="row.product.validation"
                    v-on:update:modelValue="inputProduct(index)"
                    :id="index + 'product'"
                    :disabled="row.disabled && mode != 1"
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
                    :disabled="row.disabled && mode != 1"
                    :viewMode="disabled"
                  />
                </td>
                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    :validation="row.purchase_price.validation"
                    v-model="row.purchase_price.value"
                    v-on:input="inputPurchasePrice(index)"
                    :disabled="row.disabled && mode != 1"
                    :viewMode="disabled"
                    ><template v-slot:pre>S/.</template>
                  </MyInput>
                  <label class="secondary-text">
                    <i class="bi bi-arrow-return-right"></i> Ant. S/.{{ row.last_purchase_price.value }}
                  </label>
                </td>
                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    :validation="row.sale_price.validation"
                    v-model="row.sale_price.value"
                    v-on:input="inputSalePrice(index)"
                    :disabled="row.disabled && mode != 1"
                    :viewMode="disabled"
                    ><template v-slot:pre>S/.</template>
                  </MyInput>
                  <label class="secondary-text">
                    <i class="bi bi-arrow-return-right"></i> Ant. S/.{{ row.last_sale_price.value }}
                  </label>
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
                      v-if="row.disabled && mode != 1"
                      :disabled="disabledListButtons"
                      type="button"
                      class="btn btn-sm btn-primary me-1"
                      @click="buttonListEdit(index)"
                    >
                      <i class="bi bi-pen"></i>
                    </button>
                    <button
                      v-if="!row.disabled"
                      type="button"
                      class="btn btn-sm btn-secondary me-1"
                      @click="buttonListCancel(index)"
                    >
                      <i class="bi bi-arrow-left"></i>
                    </button>
                    <button
                      v-if="!row.disabled"
                      type="button"
                      class="btn btn-sm btn-primary me-1"
                      @click="buttonListSave(index)"
                    >
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button
                      v-if="row.disabled"
                      :disabled="disabledListButtons"
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
import ProductDetail from "@/components/product/ProductDetail.vue";

import { ModelInput } from "@/mixin/models/ModelInput";
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
    ProductDetail,
  },
  name: "DetailInput",
  data() {
    return {
      disabled: false,
      disabledListButtons: false,
      mode: 0,
      title: "",
      item: new ModelInput(),
      itemBackup: {},
      listBackup: [],
      loadingContentList: false,
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
    onAddProduct() {
      this.$refs.selectProduct.forEach((element) => {
        element.refresh();
      });
    },
    addProduct() {
      this.$refs.modalProduct.openAdd();
    },
    getInputDetails(id) {
      this.loadingContentList = true;
      this.getInputDetailRegisters(id).then((response) => {
        if (response.success) {
          this.listBackup = response.response.data.results;
          console.log(this.listBackup);
          this.item.detailFill(response.response.data.results);
          this.loadingContentList = false;
        }
      });
    },
    inputCode() {
      this.item.header.onChangeCode();
    },
    inputProvider() {
      this.item.header.onChangeProvider();
    },
    inputDescription() {
      this.item.header.onChangeDescription();
    },
    inputProduct(index) {
      this.item.detail[index].onChangeProduct();
    },
    inputQuantity(index) {
      this.item.detail[index].onChangeQuantity();
    },
    inputPurchasePrice(index) {
      this.item.detail[index].onChangePurchasePrice();
    },
    inputSalePrice(index) {
      this.item.detail[index].onChangeSalePrice();
    },
    buttonAddRow() {
      this.item.detailAdd({});
    },
    buttonListSave(index) {
      if (this.item.detail[index].validateForm()) {
        if (this.item.detail[index].id.value == undefined) {
          //agregado recientemente
          this.addInputDetailRegister(this.item.detail[index].getToAddId(this.item.header.id.value)).then(
            (response) => {
              if (response.success) {
                this.disabledListButtons = false;
                this.getInputDetails(this.item.header.id.value);
              }
            }
          );
        } else {
          //editado
          this.editInputDetailRegister(this.item.detail[index].getToEdit()).then((response) => {
            if (response.success) {
              this.disabledListButtons = false;
              this.getInputDetails(this.item.header.id.value);
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
      this.disabledListButtons = true;
      this.item.detail[index].disabled = false;
    },
    buttonListCancel(index) {
      this.disabledListButtons = false;
      this.item.detail[index].disabled = true;
      this.item.detail[index].setFromData(this.listBackup[index]);
      this.item.detail[index].resetValidation();
    },
    buttonListDelete(index) {
      if (this.mode == 1 || this.item.detail[index].id.value == undefined) {
        this.item.detailDelete(index);
      } else {
        this.confirmDeleteInputDetailRegister(this.item.detail[index].id.value).then((response) => {
          if (response.success) {
            this.getInputDetails(this.item.header.id.value);
          }
        });
      }
    },
    async buttonSave() {
      if (this.item.validateForm()) {
        if (this.item.detail.length > 0) {
          switch (this.mode) {
            case 1:
              this.addInputRegister(this.item.header.getToAdd()).then((response) => {
                var id_order = 0;
                if (response.success) {
                  id_order = response.response.data.id;
                  this.addInputDetailRegisters(this.item.getDetailToJSON(id_order)).then((response) => {
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
              this.editInputRegister(this.item.header.getToEdit()).then((response) => {
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
      this.item.detailFill(this.listBackup);
      this.changeMode(2);
    },
    buttonDelete() {
      this.confirmDeleteInputRegister(this.item.header.id.value).then((response) => {
        if (response.success) {
          this.$emit("item:delete");
          this.closeModal();
        }
      });
    },
    changeMode(mode) {
      this.mode = mode;
      this.disabledListButtons = false;
      this.item.resetValidation();
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
    openAdd() {
      this.changeMode(1);
      this.openModal();
      this.itemBackup = {};
      this.item.header.setFromData({});
      this.listBackup = [];
      this.item.detail = [];
      this.item.detailAdd({});
    },
    openView(data) {
      var lastId = this.itemBackup.id;
      var newId = data.id;
      this.changeMode(2);
      this.openModal();
      this.itemBackup = JSON.parse(JSON.stringify(data));
      this.item.header.setFromData(data);
      if (lastId == newId) {
        this.item.detailFill(this.listBackup);
      } else {
        this.getInputDetails(this.item.header.id.value);
      }
    },
    openViewId(id) {
      this.getInputRegister(id).then((response) => {
        if (response.success) {
          this.openView(response.response.data);
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
