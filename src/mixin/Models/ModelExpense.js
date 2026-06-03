import { Validation } from "@/mixin/models/Validation";

export class ModelExpense {
  id = { value: undefined };
  description = { value: "", validation: {} };
  amount = { value: "", validation: {} };
  expense_date = { value: "", validation: {} };
  payment_method = { value: "1", validation: {} };
  category = { value: undefined, validation: {} };
  notes = { value: "", validation: {} };
  evidence = { value: null, validation: {} };

  onChangeDescription() {
    this.description.validation = Validation.requiredText(this.description.value, 2, 250);
  }

  onChangeAmount() {
    this.amount.validation = Validation.required(this.amount.value);
  }

  onChangeDate() {
    this.expense_date.validation = Validation.required(this.expense_date.value);
  }

  onChangePaymentMethod() {
    this.payment_method.validation = Validation.required(this.payment_method.value);
  }

  onChangeCategory() {
    this.category.validation = Validation.required(this.category.value);
  }

  onChangeNotes() {
    this.notes.validation = Validation.noRequiredText(this.notes.value, 0, 1000);
  }

  validateForm() {
    this.onChangeDescription();
    this.onChangeAmount();
    this.onChangeDate();
    this.onChangePaymentMethod();
    this.onChangeCategory();
    this.onChangeNotes();

    return (
      this.description.validation.isValid &&
      this.amount.validation.isValid &&
      this.expense_date.validation.isValid &&
      this.payment_method.validation.isValid &&
      this.category.validation.isValid &&
      this.notes.validation.isValid
    );
  }

  getToAdd() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      expense_date: this.expense_date.value,
      payment_method: this.payment_method.value,
      category: this.category.value.id,
      notes: this.notes.value || "",
      evidence: this.evidence.value,
    };
  }

  getToEdit() {
    return {
      id: this.id.value,
      description: this.description.value,
      amount: this.amount.value,
      expense_date: this.expense_date.value,
      payment_method: this.payment_method.value,
      category: this.category.value.id,
      notes: this.notes.value || "",
      evidence: this.evidence.value,
    };
  }

  setFromData(data) {
    this.id.value = data?.id;
    this.description.value = data?.description || "";
    this.amount.value = data?.amount || "";
    this.expense_date.value = data?.expense_date || "";
    this.payment_method.value = data?.payment_method != null ? String(data.payment_method) : "1";
    this.notes.value = data?.notes || "";
    this.evidence.value = null;

    if (data?.category != null) {
      this.category.value = {
        id: data.category,
        name: data.category_name,
      };
    } else {
      this.category.value = undefined;
    }
  }

  resetValidation() {
    this.description.validation = {};
    this.amount.validation = {};
    this.expense_date.validation = {};
    this.payment_method.validation = {};
    this.category.validation = {};
    this.notes.validation = {};
    this.evidence.validation = {};
  }
}