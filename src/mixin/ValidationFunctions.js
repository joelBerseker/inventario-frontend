export default {
  methods: {
    validateInput(text, validationMessage, required) {
      var validationStyle = "";
      var isValid = true;

      if (this.textEmpty(text, "") && !required) {
        validationMessage = "No requerido";
      } else {
        validationStyle = validationMessage != "" ? " is-invalid" : " is-valid";
        isValid = validationMessage != "" ? false : true;
      }

      var response = {
        validationMessage: validationMessage,
        validationStyle: validationStyle,
        isValid: isValid,
      };
      return response;
    },

    onlyText(text, previus_message) {
      var message_ = previus_message;
      if (message_ == "") {
        if (!this.regular_expressions.onlyText.test(text)) {
          message_ = "Solo se permite texto";
        }
      }
      return message_;
    },
    textEmpty(text, previus_message) {
      var message_ = previus_message;
      if (message_ == "") {
        if (text == "" || text == null || text == undefined) {
          message_ = "Por favor ingrese un valor";
        }
      }
      return message_;
    },
    textLength(text, previus_message, min, max) {
      var message_ = previus_message;
      if (message_ == "") {
        if (text == null) {
          if (0 < min) {
            message_ = "Debe contener al menos " + min + " caracteres";
          } else if (0 > max) {
            message_ = "Debe contener como maximo " + max + " caracteres";
          }
        } else {
          if (text.length < min) {
            message_ = "Debe contener al menos " + min + " caracteres";
          } else if (text.length > max) {
            message_ = "Debe contener como maximo " + max + " caracteres";
          }
        }
      }
      return message_;
    },
    optionSelect(text) {
      var valid_ = text == 0 || text == null;
      var message_ = "Por favor seleccione un valor";
      return { valid: !valid_, message: message_ };
    },
    fileUploaded(text) {
      var valid_ = text == null;
      var message_ = "Por favor suba un archivo";
      return { valid: !valid_, message: message_ };
    },
    changeCurrency(data) {
      var text = data.toString().replace(/[^0-9]/, "");
      console.log("lengh -> " + text.length);
      console.log("text -> " + text);
      if (text.length >= 3) {
        var firsPart = text.slice(0, -2);
        var lastPart = text.slice(text.length - 2);
        var complete = firsPart + "." + lastPart;
        console.log(complete);
        return Number(complete).toFixed(2);
      }
      return data;
    },
    validationRequired(text) {
      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      return this.validateInput(text, validationMessage, true);
    },
    validationRequiredText(text, min, max) {
      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, min, max);
      return this.validateInput(text, validationMessage, true);
    },
    validationNoRequiredText(text, min, max) {
      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      validationMessage = this.textLength(text, validationMessage, min, max);
      return this.validateInput(text, validationMessage, false);
    },
    validationRequiredSelect(text) {
      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      return this.validateInput(text, validationMessage, true);
    },
    validationRequiredNumber(text) {
      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      return this.validateInput(text, validationMessage, true);
    },
    validationRequiredDate(text) {
      var validationMessage = "";
      validationMessage = this.textEmpty(text, validationMessage);
      return this.validateInput(text, validationMessage, true);
    },

    inputOnlyNumberPlus(text){
        return text.toString().replace(/[^0-9+]/, "");
    },
    inputOnlyNumber(text){
        return text.toString().replace(/[^0-9]/, "");
    }
  },
  data() {
    return {
      regular_expressions: {
        onlyNumber: /^[0-9].*$/,
        onlyTextAndNumber: /^[a-zá-úÁ-ÚA-Z0-9 _.,:;"#%&~^/(){}!¡¿?/\\/]*$/,
        onlyText: /^[a-zá-úÁ-ÚA-Z ]*$/,
        onlyTextAndNumber1: /^[a-zá-úÁ-ÚA-Z0-9 ]*$/,
        onlyTextAndNumber2: /^[a-zá-úÁ-ÚA-Z0-9/{/},.:;_!"#$%?¿&()\- //+-/*/[\]]*$/,
      },
    };
  },
};
