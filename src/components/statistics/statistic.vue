<script>
import SystemContent from "@/components/system/SystemContent.vue";
import { defineComponent, toRaw } from "vue";
import VueApexCharts from "vue3-apexcharts";
import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Statistics",
  props: ["changeTopbar"],
  components: {
    SystemContent,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      loadingContentSystem: false,
      topbar: {
        title: "Estadisticas",
        icon: "icon",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
          {
            name: "Estadisticas",
            link: "",
          },
        ],
      },
      options: {
        chart: {
          type: "bar",
          id: "vuechart-example",
        },
        xaxis: {
          categories: [
            "Hace 7 dias",
            "Hace 6 dias",
            "Hace 5 dias",
            "Hace 4 dias",
            "Hace 3 dias",
            "Hace 2 dias",
            "Hace 1 dia",
            "Hoy",
          ],
        },
        fill: {
          opacity: 1,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        yaxis: {
          title: {
            text: "s/ (soles)",
          },
        },
        title: {
          text: "Entradas y Salidas",
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "s/ " + val.toFixed(2) + " soles";
            },
          },
        },
      },
      datesCharts: [],
      salesCharts: [],
      series: [
        {
          name: "Gastos del Dia",
          data: [30, 40, 45, null, 49, 60, 70, 91],
        },
        {
          name: "Ganancias del dia",
          data: [76, 85, 101, 98, 87, null, 91, 114],
        },
      ],
    };
  },
  methods: {
    createDates() {
      const lessDays = 8;
      const dates = [];

      for (let index = lessDays - 1; index >= 0; index--) {
        const day = new Date();
        day.setDate(day.getDate() - index);
        const year = day.getFullYear();
        const month = String(day.getMonth() + 1).padStart(2, "0");
        const dayOfMonth = String(day.getDate()).padStart(2, "0");
        dates.push(`${year}-${month}-${dayOfMonth}`);
      }

      this.datesCharts = dates;
      return dates;
    },

    async getSale(date) {
      try {
        const path = `${url}orders/orders/orders_with_total_sum/?specific_date=${date}`;
        const response = await axios.get(path);
        return { date: date, sale: response.data.total_sum };
      } catch (error) {
        console.log(error);
        return { date: date, sale: null };
      }
    },
    async populateSalesCharts() {
      const results = await Promise.all(this.datesCharts.map(this.getSale));
      this.salesCharts = results;
      console.log(this.salesCharts);
      this.series[1].data = this.salesCharts.map((item) => item.sale);
    },
  },
  async created() {
    this.changeTopbar(this.topbar);
    this.datesCharts = this.createDates();
    await this.populateSalesCharts();
  },
});
</script>
<template>
  <SystemContent ref="content" :loading="loadingContentSystem">
    <div>
      <apexchart
        width="500"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
  </SystemContent>
</template>

<style scoped></style>
