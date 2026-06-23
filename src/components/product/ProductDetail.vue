<template>
  <MyModal ref="myModal" :id="'productDetailModal'" :title="this.title" v-on:mymodal:close="closeModal">
    <div class="modal-body">
      <MyInput class="mb-3" type="text" name="Nombre" :validation="item.name.validation" v-model="item.name.value"
        :disabled="disabled" v-on:input="inputName()" />


      <div class="row mb-3">
        <div class="col-6">
          <MyInput type="text" name="Precio de Compra" :validation="item.cost.validation" v-model="item.cost.value"
            v-on:input="inputCost()" :disabled="disabled">
            <template v-slot:pre>S/.</template>
          </MyInput>
        </div>

        <div class="col-6">
          <MyInput type="text" name="Precio de Venta" :validation="item.price.validation" v-model="item.price.value"
            v-on:input="inputPrice()" :disabled="disabled">
            <template v-slot:pre>S/.</template>
          </MyInput>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-6">
          <SelectSearch name="Categoria" :validation="item.category.validation" v-model="item.category.value"
            link="categories/categories/" v-on:update:modelValue="inputCategory()" id="Categoria"
            :disabled="disabled" />
        </div>

        <div class="col-6">
          <MyInput type="text" name="Cantidad en Inventario" :validation="item.stock.validation"
            v-model="item.stock.value" :disabled="disabled" v-on:input="inputStock()" />
        </div>
      </div>

      <MyInput type="textarea" name="Descripción" :validation="item.description.validation"
        v-model="item.description.value" :disabled="disabled" v-on:input="inputDescription()" />

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

      <button type="button" @click="buttonPrintBarcode" class="btn btn-success btn-sm button-margin" v-if="mode == 2">
        <i class="bi bi-printer"></i>
        Imprimir Código de Barras
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

<script>
import { defineComponent } from "vue";
import MyModal from "@/components/my_components/MyModal.vue";
import MyInput from "@/components/my_components/MyInput.vue";
import SelectSearch from "@/components/my_other_components/SelectSearch.vue";
import ValidationFunctions from "@/mixin/ValidationFunctions.js";
import ConectionProduct from "@/mixin/conections/ConectionProduct";
import { ModelProduct } from "@/mixin/models/ModelProduct";

export default defineComponent({
  mixins: [ValidationFunctions, ConectionProduct],
  inject: ["confirmDialogue", "showToast"],
  components: {
    MyModal,
    MyInput,
    SelectSearch,
  },
  name: "Product",
  data() {
    return {
      disabled: false,
      mode: 0,
      title: "",
      item: new ModelProduct(),
      itemBackup: {},
    };
  },

  computed: {
    barcodeImageUrl() {
      return (
        this.item?.barcode_image_url?.value ||
        this.item?.barcode_image?.value ||
        this.item?.barcode_image_url ||
        this.item?.barcode_image ||
        null
      );
    },
  },

  methods: {
    openLabelUrl(url) {
      window.open(url, "_blank");
    },

    inputCode() {
      // el código ya no se edita manualmente
      // se deja por compatibilidad si tu modelo aún llama esta función
      this.item.onChangeCode?.();
    },

    inputName() {
      this.item.onChangeName();
    },

    inputPrice() {
      this.item.onChangePrice();
    },

    inputCost() {
      this.item.onChangeCost();
    },

    inputStock() {
      this.item.onChangeStock();
    },

    inputDescription() {
      this.item.onChangeDescription();
    },

    inputCategory() {
      this.item.onChangeCategory();
    },

    async buttonPrintBarcode() {
      const productId = this.item?.id?.value;

      if (!productId) {
        this.showToast({
          title: "Ocurrió un error",
          message: "No se encontró el ID del producto para imprimir.",
          type: 2,
        });
        return;
      }

      const baseUrl =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_RUTA_API;

      if (!baseUrl) {
        this.showToast({
          title: "Configuración faltante",
          message:
            "No se encontró la URL base del API en las variables de entorno.",
          type: 2,
        });
        return;
      }

      const normalizedBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;

      const url = `${normalizedBaseUrl}/products/products/label30x20/${productId}/`;

      try {
        await this.openLabelUrl(url);
      } catch (error) {
        console.log("Error abriendo etiqueta:", error);
        this.showToast({
          title: "Ocurrió un error",
          message: "No se pudo abrir la etiqueta para imprimir.",
          type: 2,
        });
      }
    },

    buttonSave() {
      if (this.item.validateForm()) {
        switch (this.mode) {
          case 1:
            this.addProductRegister(this.item.getToAdd()).then((response) => {
              if (response.success) {
                this.$emit("item:add");
                this.closeModal();
              }
            });
            break;

          case 3:
            this.editProductRegister(this.item.getToEdit()).then((response) => {
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
          message:
            "Datos no válidos, revise si todos los campos se llenaron correctamente.",
          type: 2,
        });
      }
    },

    buttonEdit() {
      this.changeMode(3);
    },

    buttonCancel() {
      this.item.setFromData(this.itemBackup);
      this.changeMode(2);
    },

    buttonDelete() {
      this.confirmDeleteProductRegister(this.item.id.value).then((response) => {
        if (response.success) {
          this.$emit("item:delete");
          this.closeModal();
        }
      });
    },

    changeMode(mode) {
      this.mode = mode;
      this.item.resetValidation();

      switch (this.mode) {
        case 1:
          this.title = "Agregar Producto";
          this.disabled = false;
          break;

        case 2:
          this.title = "Visualizar Producto";
          this.disabled = true;
          break;

        case 3:
          this.title = "Editar Producto";
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
      this.item.setFromData({});

      // no se escribe código manualmente
      this.item.code.value = "";
    },

    openView(data) {
      this.changeMode(2);
      this.openModal();
      this.itemBackup = JSON.parse(JSON.stringify(data));
      this.item.setFromData(data);
    },

    openViewId(id) {
      this.getProductRegister(id).then((response) => {
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
});
</script>

<style scoped>
.button-margin {
  margin-left: 0.25rem;
  margin-right: 0 !important;
  margin-top: 0;
  margin-bottom: 0;
}

.barcode-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.barcode-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.barcode-image {
  max-width: 280px;
  max-height: 140px;
  object-fit: contain;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: #fff;
}

.barcode-empty {
  font-size: 0.9rem;
  color: #6c757d;
  padding: 0.75rem;
  border: 1px dashed #ced4da;
  border-radius: 0.5rem;
  background: #f8f9fa;
}
</style>
