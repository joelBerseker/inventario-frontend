<script>
import Content from "@/components/home/Content.vue";
import { defineComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";
import axios from "axios";
const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "Statistics",
  props: ["changeTopbar", "showToast", "confirmDialogue"],
  components: {
    Content,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      loading: false,
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
              text: 'Entradas y Salidas'
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
      salesCharts:[],
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
    loadingContent(loading) {
      this.$refs.content.loadingContent(loading);
    },
    createDates() {
      var dt = new Date(); //current date of week
      var lessDays = 7;
      var wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
      for (let index = 0; index < 8; index++) {
        var day = new Date(
          new Date(wkStart).setDate(wkStart.getDate() + index)
        );
        this.datesCharts.push(day);
      }
      return this.changeDates();
    },
    changeDates() {
      return this.datesCharts.map((element) => {
        const year = element.getFullYear();
        const month = String(element.getMonth() + 1).padStart(2, "0");
        const day = String(element.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      });
    },
    async getSale(date){
      var sale = null;
      var path = url + "orders/orders/orders_with_total_sum/?specific_date="+date;
      await axios
        .get(path)
        .then((response) => {
          sale = response.data.total_sum;
        })
        .catch((e) => {
          console.log(e);
        });
      return sale;
    },
    async getSales(){
      this.datesCharts.forEach(element => {
        const sale = null;
        this.getSale(element).then(val =>  this.salesCharts.push(val));
      });
      console.log(this.salesCharts);
      this.series[1].data = this.salesCharts;
    }
  },
  async created() {
    this.changeTopbar(this.topbar);
    this.datesCharts=this.createDates();
    await this.getSales();
  },
});
</script>
<template>
  <Content ref="content" :loading="loading">
    <div>
      <apexchart
        width="500"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
  </Content>
</template>

<style scoped></style>
