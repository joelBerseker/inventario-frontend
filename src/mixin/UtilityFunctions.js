export default {
  data() {
    return {
      optionsDocumentType: [
        { value: "1", text: "DNI" },
        { value: "2", text: "RUC" },
        { value: "3", text: "Otro" },
      ],
      optionsPaymentType: [
        { value: 1, text: "Efectivo" },
        { value: 2, text: "YAPE" },
        { value: 3, text: "Tarjeta" },
        { value: 4, text: "Otro" },
      ],
    };
  },
  methods: {
    priceCorrect(price) {
      return "S/. " + parseFloat(price).toFixed(2);
    },
    getDocumentType(number) {
      return this.optionsDocumentType[number - 1].text;
    },
    getPaymentType(number) {
      return this.optionsPaymentType[number - 1].text;
    },
    timeAgo(time) {
      const date = new Date(time);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      const dayDiff = Math.floor(diffInSeconds / 86400);

      if (isNaN(dayDiff) || dayDiff < 0) {
        return "---";
      }

      if (dayDiff === 0) {
        if (diffInSeconds < 60) {
          return "Hace un momento";
        } else if (diffInSeconds < 120) {
          return "Hace 1 minuto";
        } else if (diffInSeconds < 3600) {
          return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
        } else if (diffInSeconds < 7200) {
          return "Hace 1 hora";
        } else {
          return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        }
      } else if (dayDiff === 1) {
        return "Ayer";
      } else if (dayDiff < 7) {
        return `Hace ${dayDiff} días`;
      } else if (dayDiff < 31) {
        const weekDiff = Math.floor(dayDiff / 7);
        return `Hace ${weekDiff} ${weekDiff > 1 ? "semanas" : "semana"} y ${dayDiff % 7} ${
          dayDiff % 7 > 1 ? "días" : "día"
        }`;
      } else {
        const monthDiff = Math.floor(dayDiff / 30);
        return `Hace ${monthDiff} ${monthDiff > 1 ? "meses" : "mes"} y ${dayDiff % 30} ${
          dayDiff % 30 > 1 ? "días" : "día"
        }`;
      }
    },
  },
};
