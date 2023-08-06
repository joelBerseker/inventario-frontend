export default {
  methods: {
    priceCorrect(price) {
      return "s/ " + parseFloat(price).toFixed(2);
    },

    documentType(number) {
        var text ="";
      switch (number) {
        case 1:
            text="DNI"
          break;
        case 2:
            text="RUC"
          break;
        case 3:
            text="Otro"
          break;
        default:
            text="Pasaporte"
          break;
      }
      return text;
    },
    timeAgo(time) {
      var date = new Date(time),
        diff = (new Date().getTime() - date.getTime()) / 1000,
        day_diff = Math.floor(diff / 86400);
      if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return "---";

      return (
        (day_diff == 0 &&
          ((diff < 60 && "Hace un momento") ||
            (diff < 120 && "Hace 1 minuto") ||
            (diff < 3600 && "Hace " + Math.floor(diff / 60) + " minutos") ||
            (diff < 7200 && "Hace 1 hora") ||
            (diff < 86400 && "Hace " + Math.floor(diff / 3600) + " horas"))) ||
        (day_diff == 1 && "Ayer") ||
        (day_diff < 7 && "Hace " + day_diff + " dias") ||
        (day_diff < 31 && "Hace " + Math.ceil(day_diff / 7) + " semanas")
      );
    },
  },
};
