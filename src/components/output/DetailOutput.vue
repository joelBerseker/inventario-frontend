<template>
  <MyModal
    ref="myModal"
    :id="'productDetailModal'"
    :title="this.title"
    size="modal-xl"
    v-on:mymodal:close="closeModal"
  >
    <div class="modal-body">
      <div class="row">
        <div class="col-3 head pe-3">
          <MyInput
            v-if="mode !== 1"
            class="mb-3"
            type="text"
            name="Número de venta"
            :validation="item.header.order_code.validation"
            v-model="item.header.order_code.value"
            :disabled="true"
          />

          <div class="mb-3">
            <SelectSearch
              v-if="clientReady || mode !== 1"
              :key="clientSelectKey"
              v-model="item.header.client.value"
              link="clients/clients/"
              name="Cliente"
              :validation="item.header.client.validation"
              id="cliente"
              :disabled="disabled"
              v-on:update="inputClient()"
            />
          </div>

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
          <div class="scan-box mb-3" v-if="mode != 2">
            <div class="row g-2 align-items-end">
              <div class="col-7">
                <MyInput
                  ref="scannerInput"
                  type="text"
                  name="Escanear código de barras"
                  v-model="scanCode"
                  :disabled="disabled || processingScan"
                  v-on:keyup.enter="handleScan"
                />
              </div>

              <div class="col-5 d-flex align-items-end">
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm w-100"
                  :disabled="disabled || processingScan || !scanCode.trim()"
                  @click="handleScan"
                >
                  <i class="bi bi-upc-scan"></i>
                  Agregar por código
                </button>
              </div>
            </div>

            <div class="scan-help mt-2">
              Escanea el producto. Si ya existe en la lista, se suma la cantidad automáticamente.
            </div>
          </div>

          <div class="manual-box mb-3" v-if="mode != 2">
            <div class="row g-2 align-items-end">
              <div class="col-9">
                <SelectSearch
                  :key="manualProductKey"
                  v-model="manualProduct"
                  link="products/products/"
                  name="Buscar producto por nombre o código"
                  id="manual-product-search"
                  :disabled="disabled || processingScan"
                />
              </div>

              <div class="col-3 d-flex align-items-end">
                <button
                  type="button"
                  class="btn btn-primary btn-sm w-100"
                  :disabled="disabled || !manualProduct?.id"
                  @click="addManualProduct"
                >
                  <i class="bi bi-plus-circle"></i>
                  Agregar producto
                </button>
              </div>
            </div>

            <div class="scan-help mt-2">
              También puedes buscar manualmente y agregar el producto a la venta.
            </div>
          </div>

          <div class="row mb-3 d-flex align-items-end">
            <div class="col">
              <p class="title-text">Lista de Productos</p>
            </div>

            <div class="col-2">
              <MyInput
                name="Subtotal"
                type="number"
                viewClass="text-end"
                inputClass="text-end"
                labelClass="text-end"
                v-model="item.header.subtotal_price.value"
                :disabled="true"
                :viewMode="disabled"
              >
                <template v-slot:pre>S/.</template>
              </MyInput>
            </div>

            <div class="col-2">
              <MyInput
                name="Descuento"
                type="text"
                viewClass="text-end"
                inputClass="text-end"
                labelClass="text-end"
                v-model="item.header.discount.value"
                :disabled="disabled"
                :viewMode="disabled"
                v-on:input="inputDiscount()"
                v-on:blur="formatDiscount()"
              >
                <template v-slot:pre>S/.</template>
              </MyInput>
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
              >
                <template v-slot:pre>S/.</template>
              </MyInput>
            </div>
          </div>

          <ListContent
            ref="tableContent"
            :loading="this.loadingContentList"
            :size="item.detail.length"
          >
            <table class="my-table w-100">
              <tr>
                <th style="width: 34%">Nombre</th>
                <th class="text-end" style="width: 12%">Stock</th>
                <th class="text-end" style="width: 16%">Cantidad</th>
                <th class="text-end" style="width: 18%">Precio venta</th>
                <th class="text-end" style="width: 18%">Subtotal</th>
                <th v-if="mode != 2"></th>
              </tr>

              <tr
                v-for="(row, index) in item.detail"
                :key="row._renderKey || index"
                class="detalle-item"
              >
                <td>
                  <div class="product-scanned-box">
                    <div class="product-scanned-name">
                      {{ row.product_name || row.product?.value?.name || "Producto" }}
                    </div>
                    <small class="product-scanned-code">
                      {{ row.product?.value?.code || `ID: ${row.product?.value?.id || "-"}` }}
                    </small>
                  </div>
                </td>

                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    v-model="row.stock.value"
                    :disabled="true"
                    :viewMode="disabled"
                  />
                </td>

                <td>
                  <div class="qty-box">
                    <button
                      v-if="mode != 2 && !disabled"
                      type="button"
                      class="btn btn-sm btn-light qty-btn"
                      @click="decreaseQuantity(index)"
                    >
                      <i class="bi bi-dash"></i>
                    </button>

                    <MyInput
                      type="number"
                      inputClass="text-end"
                      viewClass="text-end"
                      :validation="row.quantity.value"
                      v-model="row.quantity.value"
                      v-on:input="inputQuantity(index)"
                      :disabled="false"
                      :viewMode="disabled"
                    />

                    <button
                      v-if="mode != 2 && !disabled"
                      type="button"
                      class="btn btn-sm btn-light qty-btn"
                      @click="increaseQuantity(index)"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </td>

                <td>
                  <MyInput
                    type="number"
                    inputClass="text-end"
                    viewClass="text-end"
                    v-model="row.new_sale_price.value"
                    :disabled="true"
                    :viewMode="disabled"
                  >
                    <template v-slot:pre>S/.</template>
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
                  >
                    <template v-slot:pre>S/.</template>
                  </MyInput>
                </td>

                <td v-if="!disabled">
                  <div class="d-flex">
                    <button
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

    <div class="modal-footer footer-output">
      <div v-if="isCanceled" class="cancel-info">
        <div class="cancel-title">
          <i class="bi bi-exclamation-triangle"></i>
          Orden anulada
        </div>
        <div><b>Motivo:</b> {{ cancelReason || "Sin motivo registrado" }}</div>
        <div><b>Fecha:</b> {{ canceledAtText }}</div>
      </div>

      <div class="footer-actions">
        <button
          type="button"
          @click="buttonPrintTicket"
          class="btn btn-success btn-sm button-margin"
          v-if="mode == 2 && !isCanceled"
          :disabled="!item.header.id.value"
        >
          <i class="bi bi-printer"></i>
          Imprimir Ticket
        </button>

        <button
          type="button"
          @click="buttonDelete"
          class="btn btn-danger btn-sm button-margin"
          v-if="mode == 2 && isAdmin"
        >
          <i class="bi bi-trash"></i>
          Eliminar
        </button>

        <button
          type="button"
          @click="buttonEdit"
          class="btn btn-primary btn-sm button-margin"
          v-if="mode == 2 && isAdmin && !isCanceled"
        >
          <i class="bi bi-pen"></i>
          Editar
        </button>

        <button
          type="button"
          @click="buttonCancel"
          class="btn btn-secondary btn-sm button-margin"
          v-if="mode == 3"
        >
          <i class="bi bi-arrow-left"></i>
          Cancelar
        </button>

        <button
          type="button"
          @click="buttonSave"
          class="btn btn-primary btn-sm button-margin"
          v-if="mode != 2"
        >
          <i class="bi bi-check-lg"></i>
          Guardar
        </button>
      </div>
    </div>
  </MyModal>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
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
import AuthService from "@/services/AuthService";

export default defineComponent({
  mixins: [
    ValidationFunctions,
    UtilityFunctions,
    ConectionOutput,
    ConectionOutputDetail,
  ],
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
      disabledListButtons: false,
      mode: 0,
      title: "",
      item: new ModelOutput(),
      itemBackup: {},
      listBackup: [],
      loadingContentList: false,

      scanTimer: null,
      scanCode: "",
      processingScan: false,

      clientSelectKey: 0,
      clientReady: false,

      manualProduct: {
        id: null,
        name: "",
      },
      manualProductKey: 0,

      optionsPaymentType: [
        { value: "1", text: "Efectivo" },
        { value: "2", text: "Yape" },
        { value: "3", text: "Plin" },
        { value: "4", text: "Transferencia" },
        { value: "5", text: "Tarjeta" },
      ],
    };
  },

  computed: {
    currentUser() {
      return AuthService.getCurrentUser?.();
    },

    isAdmin() {
      return !!(this.currentUser?.is_superuser || this.currentUser?.is_admin);
    },

    isSeller() {
      return !!(this.currentUser?.is_staff && !this.isAdmin);
    },

    isCanceled() {
      return (
        this.itemBackup?.canceled === true ||
        this.itemBackup?.canceled === "true" ||
        this.itemBackup?.canceled === 1
      );
    },

    cancelReason() {
      return this.itemBackup?.cancel_reason || "";
    },

    canceledAtText() {
      if (!this.itemBackup?.canceled_at) return "-";
      return new Date(this.itemBackup.canceled_at).toLocaleString();
    },
  },

  watch: {
    "item.detail": {
      handler() {
        this.recalculateTotals();
      },
      deep: true,
    },

    scanCode(newVal) {
      if (this.disabled || this.processingScan || this.mode === 2) return;
      if (!newVal || !newVal.trim()) return;

      clearTimeout(this.scanTimer);

      this.scanTimer = setTimeout(() => {
        this.handleScan();
      }, 120);
    },
  },

  methods: {
    getApiBaseUrl() {
      const baseUrl =
        import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_APP_RUTA_API ||
        "";
      return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    },

    recalculateTotals() {
      let subtotal = 0;

      this.item.detail.forEach((element) => {
        subtotal += Number(element.subtotal?.value || 0);
      });

      let discount = Number(this.item.header.discount?.value || 0);

      if (isNaN(discount) || discount < 0) {
        discount = 0;
      }

      if (discount > subtotal) {
        discount = subtotal;
      }

      this.item.header.subtotal_price.value = subtotal.toFixed(2);
      this.item.header.total_price.value = (subtotal - discount).toFixed(2);
    },

    inputDiscount() {
      let raw = String(this.item.header.discount.value ?? "");
      raw = raw.replace(/,/g, ".");
      raw = raw.replace(/[^0-9.]/g, "");

      const parts = raw.split(".");
      if (parts.length > 2) {
        raw = `${parts[0]}.${parts.slice(1).join("")}`;
      }

      this.item.header.discount.value = raw;
      this.item.header.onChangeDiscount?.();
      this.recalculateTotals();
    },

    formatDiscount() {
      let discount = Number(this.item.header.discount?.value || 0);

      if (isNaN(discount) || discount < 0) {
        discount = 0;
      }

      const subtotal = Number(this.item.header.subtotal_price?.value || 0);
      if (discount > subtotal) {
        discount = subtotal;
      }

      this.item.header.discount.value = discount.toFixed(2);
      this.recalculateTotals();
    },

    async getProductByCode(code) {
      try {
        const url = `${this.getApiBaseUrl()}products/products/by-code/`;
        const response = await axios.get(url, { params: { code } });
        return { success: true, response };
      } catch (error) {
        return { success: false, error };
      }
    },

    normalizeScannedCode(raw) {
      let value = String(raw || "").trim().toUpperCase();

      if (!value) return "";

      value = value.replace(/\s+/g, "");
      value = value.replace(/['‘’`´]/g, "-");

      if (value.startsWith("PRODUCT:")) {
        value = value.replace("PRODUCT:", "").trim();
      }

      if (/^\d+$/.test(value)) {
        return `P${value.padStart(6, "0")}`;
      }

      let match = value.match(/^P(\d+)$/);
      if (match) {
        return `P${match[1].padStart(6, "0")}`;
      }

      return value;
    },

    buildProductPayload(product) {
      return {
        id: product.id,
        name: product.name,
        code: product.code,
        price: Number(product.price || 0),
        stock: Number(product.stock || 0),
      };
    },

    addOrIncrementProduct(product) {
      const payload = this.buildProductPayload(product);
      const productId = String(payload.id);

      const existingIndex = this.item.detail.findIndex((row) => {
        return String(row.product?.value?.id || "") === productId;
      });

      if (existingIndex !== -1) {
        const row = this.item.detail[existingIndex];
        const stock = Number(payload.stock || 0);
        const currentQty = Number(row.quantity.value || 0);

        if (currentQty + 1 > stock) {
          this.showToast({
            title: "Stock insuficiente",
            message: `No puede agregar más unidades de ${payload.name}. Stock disponible: ${stock}.`,
            type: 2,
          });
          return false;
        }

        row.product.value = payload;
        row.stock.value = stock;
        row.quantity.value = currentQty + 1;
        row.new_sale_price.value = Number(payload.price).toFixed(2);
        row.subtotal.value = (
          Number(row.quantity.value) * Number(payload.price)
        ).toFixed(2);
        row.product_name = payload.name;
        row.product_scanned = true;
        row.disabled = false;

        this.recalculateTotals();
        return true;
      }

      this.item.detailAdd({});
      const newIndex = 0;
      const row = this.item.detail[newIndex];

      row.product.value = payload;
      row.stock.value = Number(payload.stock || 0);
      row.product_name = payload.name;
      row.product_scanned = true;
      row.quantity.value = 1;
      row.new_sale_price.value = Number(payload.price).toFixed(2);
      row.subtotal.value = Number(payload.price).toFixed(2);
      row.disabled = false;
      row._renderKey = `${payload.id}-${Date.now()}`;

      if (typeof row.resetValidation === "function") {
        row.resetValidation();
      }

      this.recalculateTotals();
      return true;
    },

    async handleScan() {
      const rawCode = String(this.scanCode || "").trim();

      if (!rawCode || this.processingScan || this.mode === 2) return;

      this.processingScan = true;

      try {
        const productCode = this.normalizeScannedCode(rawCode);

        if (!productCode) {
          this.showToast({
            title: "Código inválido",
            message: "El código escaneado no es válido.",
            type: 2,
          });
          return;
        }

        const response = await this.getProductByCode(productCode);

        if (!response.success) {
          this.showToast({
            title: "Producto no encontrado",
            message: `No existe un producto con el código ${productCode}.`,
            type: 2,
          });
          return;
        }

        const product = response.response.data;
        this.addOrIncrementProduct(product);
      } finally {
        this.scanCode = "";
        this.processingScan = false;
        this.focusScannerInput();
      }
    },

    addManualProduct() {
      if (!this.manualProduct?.id) {
        this.showToast({
          title: "Producto requerido",
          message: "Seleccione un producto para agregar.",
          type: 2,
        });
        return;
      }

      const ok = this.addOrIncrementProduct(this.manualProduct);

      if (ok) {
        this.manualProduct = {
          id: null,
          name: "",
        };
        this.manualProductKey += 1;
        this.focusScannerInput();
      }
    },

    async setDefaultClient() {
      try {
        const baseUrl = this.getApiBaseUrl();

        const response = await axios.get(`${baseUrl}clients/clients/1/`);
        const client = response.data;

        this.item.header.client.value = {
          id: client.id,
          name: client.name,
        };

        this.item.header.onChangeClient?.();
        this.clientSelectKey += 1;
      } catch (error) {
        console.log("Error cargando cliente por defecto:", error);
        this.item.header.client.value = {
          id: null,
          name: "",
        };
      }
    },

    focusScannerInput() {
      this.$nextTick(() => {
        const scannerRef = this.$refs.scannerInput;
        if (!scannerRef) return;

        const input =
          scannerRef?.$el?.querySelector("input") ||
          scannerRef?.$el?.querySelector("textarea");

        if (input) {
          input.focus();
          input.select?.();
        }
      });
    },

    increaseQuantity(index) {
      const row = this.item.detail[index];
      const qty = Number(row.quantity.value || 0);
      const stock = Number(row.stock.value || 0);

      if (qty + 1 > stock) {
        this.showToast({
          title: "Stock insuficiente",
          message: "La cantidad solicitada es mayor que el stock disponible.",
          type: 2,
        });
        return;
      }

      row.quantity.value = qty + 1;
      row.subtotal.value = (
        Number(row.quantity.value) * Number(row.new_sale_price.value || 0)
      ).toFixed(2);
      this.recalculateTotals();
    },

    decreaseQuantity(index) {
      const row = this.item.detail[index];
      const qty = Number(row.quantity.value || 0);

      if (qty <= 1) return;

      row.quantity.value = qty - 1;
      row.subtotal.value = (
        Number(row.quantity.value) * Number(row.new_sale_price.value || 0)
      ).toFixed(2);
      this.recalculateTotals();
    },

    buttonPrintTicket() {
      if (this.isCanceled) {
        this.showToast({
          title: "Orden anulada",
          message: "No se puede imprimir una orden anulada.",
          type: 2,
        });
        return;
      }

      const outputId = this.item?.header?.id?.value;

      if (!outputId) {
        this.showToast({
          title: "No disponible",
          message: "Primero debes guardar la salida para poder imprimir.",
          type: 2,
        });
        return;
      }

      const baseUrl = this.getApiBaseUrl().replace(/\/$/, "");
      const url = `${baseUrl}/orders/orders/boleta/${outputId}/`;
      const win = window.open(url, "_blank");

      if (win) {
        win.focus();
      }
    },

    getOutputDetails(id) {
      this.loadingContentList = true;

      this.getOutputDetailRegisters(id).then((response) => {
        if (response.success) {
          const payload = response.response.data;
          const details = Array.isArray(payload) ? payload : payload?.results || [];

          this.listBackup = details;
          this.item.detailFill(details);
        } else {
          this.listBackup = [];
          this.item.detail = [];
        }

        this.recalculateTotals();
        this.loadingContentList = false;
      });
    },

    inputCode() {
      this.item.header.onChangeCode();
    },

    inputClient() {
      this.item.header.onChangeClient();
    },

    inputPaymentType() {
      this.item.header.onChangePaymentType();
    },

    inputDescription() {
      this.item.header.onChangeDescription();
    },

    inputQuantity(index) {
      const row = this.item.detail[index];
      row.onChangeQuantity?.();

      const qty = Number(row.quantity?.value || 0);
      const price = Number(row.new_sale_price?.value || 0);
      const stock = Number(row.stock?.value || 0);

      if (qty > stock) {
        row.quantity.validation = {
          isValid: false,
          message: "La cantidad solicitada es mayor que el stock disponible.",
        };

        this.showToast({
          title: "Stock insuficiente",
          message: "La cantidad solicitada es mayor que el stock disponible.",
          type: 2,
        });

        row.quantity.value = stock > 0 ? stock : 1;
      }

      row.subtotal.value = (
        Number(row.quantity.value || 0) * price
      ).toFixed(2);

      this.recalculateTotals();
    },

    buttonListDelete(index) {
      if (this.mode == 1 || this.item.detail[index].id.value == undefined) {
        this.item.detailDelete(index);
        this.recalculateTotals();
      } else {
        this.confirmDeleteOutputDetailRegister(this.item.detail[index].id.value).then(
          (response) => {
            if (response.success) {
              this.getOutputDetails(this.item.header.id.value);
            }
          }
        );
      }
    },

    async buttonSave() {
      this.recalculateTotals();

      if (this.item.validateForm()) {
        if (this.item.detail.length > 0) {
          switch (this.mode) {
            case 1:
              try {
                const response = await this.addOutputRegister(
                  this.item.header.getToAdd()
                );

                if (!response.success) {
                  return;
                }

                const id_order = response.response.data.id;
                this.item.header.id.value = id_order;

                const detailResponse = await this.addOutputDetailRegisters(
                  this.item.getDetailToJSON(id_order)
                );

                if (!detailResponse.success) {
                  this.showToast({
                    title: "Ocurrió un error",
                    message:
                      "Se creó la salida, pero hubo un problema al guardar el detalle.",
                    type: 2,
                  });
                  return;
                }

                this.$emit("item:add");

                const savedResponse = await this.getOutputRegister(id_order);

                if (savedResponse.success) {
                  this.openView(savedResponse.response.data);
                } else {
                  this.closeModal();
                }
              } catch (error) {
                console.log("Error guardando salida:", error);
                this.showToast({
                  title: "Ocurrió un error",
                  message: "No se pudo completar el guardado de la salida.",
                  type: 2,
                });
              }
              break;

            case 3:
              try {
                const headerResponse = await this.editOutputRegister(
                  this.item.header.getToEdit()
                );

                if (!headerResponse.success) {
                  return;
                }

                for (const detail of this.item.detail) {
                  const payload = detail.id.value
                    ? detail.getToEdit()
                    : detail.getToAddId(this.item.header.id.value);

                  let detailResponse;

                  if (detail.id.value) {
                    detailResponse = await this.editOutputDetailRegister(payload);
                  } else {
                    detailResponse = await this.addOutputDetailRegister(payload);
                  }

                  if (!detailResponse.success) {
                    this.showToast({
                      title: "Ocurrió un error",
                      message:
                        "La cabecera se actualizó, pero falló la actualización del detalle.",
                      type: 2,
                    });
                    return;
                  }
                }

                this.$emit("item:edit");

                const savedResponse = await this.getOutputRegister(
                  this.item.header.id.value
                );
                if (savedResponse.success) {
                  this.openView(savedResponse.response.data);
                } else {
                  this.closeModal();
                }
              } catch (error) {
                console.log("Error editando salida:", error);
                this.showToast({
                  title: "Ocurrió un error",
                  message: "No se pudo completar la edición de la salida.",
                  type: 2,
                });
              }
              break;
          }
        } else {
          this.showToast({
            title: "Ocurrió un error",
            message: "No se agregó ningún producto. Revise los datos.",
            type: 2,
          });
        }
      } else {
        this.showToast({
          title: "Ocurrió un error",
          message: "Datos no válidos. Revise los campos.",
          type: 2,
        });
      }
    },

    buttonEdit() {
      this.changeMode(3);
      this.focusScannerInput();
    },

    buttonCancel() {
      this.item.header.setFromData(this.itemBackup);
      this.item.detailFill(this.listBackup);
      this.recalculateTotals();
      this.changeMode(2);
    },

    buttonDelete() {
      this.confirmDeleteOutputRegister(this.item.header.id.value).then(
        (response) => {
          if (response.success) {
            this.$emit("item:delete");
            this.closeModal();
          }
        }
      );
    },

    changeMode(mode) {
      this.mode = mode;
      this.disabledListButtons = false;
      this.item.resetValidation?.();

      switch (this.mode) {
        case 1:
          this.title = "Agregar Salida";
          this.disabled = false;
          break;
        case 2:
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

    async openAddWithScan(scannedCode) {
      if (this.mode !== 1) {
        await this.openAdd();
      }

      if (!scannedCode || !String(scannedCode).trim()) return;

      this.scanCode = String(scannedCode).trim();

      await this.$nextTick();
      await this.handleScan();
    },

    async receiveExternalScan(scannedCode) {
      if (!scannedCode || !String(scannedCode).trim()) return;

      if (this.mode !== 1) {
        await this.openAdd();
      }

      this.scanCode = String(scannedCode).trim();

      await this.$nextTick();
      await this.handleScan();
    },

    async openAdd() {
      this.changeMode(1);

      this.itemBackup = {};
      this.item.header.setFromData({});
      this.listBackup = [];
      this.item.detail = [];
      this.scanCode = "";
      this.manualProduct = {
        id: null,
        name: "",
      };
      this.manualProductKey += 1;

      this.item.header.order_code.value = "";
      this.item.header.subtotal_price.value = 0;
      this.item.header.discount.value = 0;
      this.item.header.total_price.value = 0;
      this.item.header.payment_type.value = "1";
      this.item.header.client.value = {
        id: null,
        name: "",
      };

      this.clientReady = false;

      this.openModal();
      await this.$nextTick();

      await this.setDefaultClient();

      this.clientReady = true;
      await this.$nextTick();

      this.recalculateTotals();
      this.focusScannerInput();
    },

    openView(data) {
      this.changeMode(2);
      this.openModal();

      this.itemBackup = JSON.parse(JSON.stringify(data));
      this.item.header.setFromData(data);

      this.item.detail = [];
      this.listBackup = [];
      this.loadingContentList = true;

      this.getOutputDetails(data.id);
    },

    openViewId(id) {
      this.getOutputRegister(id).then((response) => {
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

.transparent {
  color: transparent !important;
}

.head {
  border-right: 1px solid rgba(0, 0, 0, 0.171);
}

.title-text {
  margin-bottom: 0;
  font-weight: 600;
}

.scan-box,
.manual-box {
  background: #f8f9fa;
  border: 1px dashed #ced4da;
  border-radius: 0.75rem;
  padding: 0.85rem;
}

.scan-help {
  font-size: 0.8rem;
  color: #6c757d;
}

.product-scanned-box {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 0.45rem 0.65rem;
  min-height: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-scanned-name {
  font-weight: 600;
  line-height: 1.1;
  color: #1f2f49;
}

.product-scanned-code {
  color: #6c757d;
  font-size: 0.75rem;
}

.qty-box {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.qty-btn {
  min-width: 30px;
  height: 30px;
  padding: 0;
}

.footer-output {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.footer-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.cancel-info {
  background: #fff3cd;
  border: 1px solid #ffecb5;
  color: #664d03;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  text-align: left;
  max-width: 65%;
}

.cancel-title {
  font-weight: 700;
  margin-bottom: 0.25rem;
}
</style>