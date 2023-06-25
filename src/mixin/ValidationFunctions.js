export default {
    methods: {
        /*showValidation(text, required, activated, mode) {
          if (mode==2) activated = true;
          if (!required) activated = false;
          return !(((text == null || text === 0) && !activated) || mode == 1);
        },*/
        showValidation(_text, _validated) {
            if (_text == null && _validated == false) {
                return false;
            } else {
                return true
            }
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
                if(text == "" || text == null){
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
    },
    data() {
        return {
            regular_expressions: {
                onlyNumber: /^[0-9].*$/,
                onlyTextAndNumber: /^[a-zá-úÁ-ÚA-Z0-9 _.,:;"#%&~^/(){}!¡¿?/\\/]*$/,
                onlyText: /^[a-zá-úÁ-ÚA-Z ]*$/,
                onlyTextAndNumber1: /^[a-zá-úÁ-ÚA-Z0-9 ]*$/,
                onlyTextAndNumber2:
                    /^[a-zá-úÁ-ÚA-Z0-9/{/},.:;_!"#$%?¿&()\- //+-/*/[\]]*$/,
            },
        };
    },
};