<template>
  <div>
    <!-- FILTROS -->
    <div class="card mb-3 filter-card">
      <div class="card-body">
        <div class="row g-2 align-items-end">
          <div class="col-12 col-md-3">
            <label class="form-label">Agrupar por</label>
            <select class="form-select form-select-sm" v-model="filters.group_by" @change="handleFilterChange">
              <option value="day">Día</option>
              <option value="week">Semana</option>
              <option value="month">Mes</option>
              <option value="year">Año</option>
            </select>
          </div>

          <div class="col-12 col-md-3" v-if="filters.group_by === 'day'">
            <label class="form-label">Fecha</label>
            <input
              type="date"
              class="form-control form-control-sm"
              v-model="filters.selected_date"
              @change="handleFilterChange"
            />
          </div>

          <div class="col-12 col-md-3" v-if="filters.group_by === 'week' || filters.group_by === 'month'">
            <label class="form-label">Año</label>
            <select class="form-select form-select-sm" v-model="filters.year" @change="handleFilterChange">
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <div class="col-12 col-md-3" v-if="filters.group_by === 'month'">
            <label class="form-label">Mes</label>
            <select class="form-select form-select-sm" v-model="filters.month" @change="handleFilterChange">
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>

          <div class="col-12 col-md-3" v-if="filters.group_by === 'year'">
            <label class="form-label">Año</label>
            <select class="form-select form-select-sm" v-model="filters.year" @change="handleFilterChange">
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <div class="col-12 col-md-3">
            <button class="btn btn-outline-secondary btn-sm w-100" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise"></i>
              Resetear filtros
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIS -->
    <div class="row mb-3">
      <div class="col-12 col-md-3" v-for="card in cards" :key="card.title">
        <div class="card stat-card mb-3">
          <div class="card-body">
            <div class="secondary-text">{{ card.title }}</div>
            <div class="title-text stat-value">{{ card.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FILA 1 -->
    <div class="row mb-3">
      <div class="col-12 col-lg-8">
        <div class="card mb-3 chart-card">
          <div class="card-body">
            <p class="title-text mb-3">{{ salesChartTitle }}</p>
            <apexchart
              type="bar"
              height="320"
              :options="salesChartOptions"
              :series="salesSeries"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card mb-3 chart-card">
          <div class="card-body">
            <p class="title-text mb-3">Ventas por categoría</p>
            <apexchart
              type="donut"
              height="320"
              :options="categoryChartOptions"
              :series="categorySeries"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- FILA 2 -->
    <div class="row">
      <div class="col-12 col-lg-6">
        <div class="card mb-3 chart-card">
          <div class="card-body">
            <p class="title-text mb-3">{{ productsChartTitle }}</p>
            <apexchart
              type="bar"
              height="340"
              :options="topProductsOptions"
              :series="topProductsSeries"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="card mb-3 chart-card">
          <div class="card-body">
            <p class="title-text mb-3">Ventas por vendedor</p>
            <apexchart
              type="bar"
              height="340"
              :options="vendorsOptions"
              :series="vendorsSeries"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

const url = import.meta.env.VITE_APP_RUTA_API;

export default defineComponent({
  name: "DashboardCharts",
  data() {
    const today = new Date();
    return {
      loading: false,
      filters: {
        group_by: "month",
        selected_date: today.toISOString().slice(0, 10),
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      },
      dashboard: {
        kpis: {
          total_sales: 0,
          total_discount: 0,
          total_orders: 0,
          avg_ticket: 0,
        },
        sales_by_period: [],
        top_products: [],
        sales_by_vendor: [],
        sales_by_category: [],
      },
      salesColors: ["#2563EB"],
      categoryColors: ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#06B6D4", "#EF4444"],
      productColors: ["#F97316"],
      vendorColors: ["#14B8A6"],
    };
  },

  computed: {
    availableYears() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 6 }, (_, i) => currentYear - i);
    },

    months() {
      return [
        { value: 1, label: "Enero" },
        { value: 2, label: "Febrero" },
        { value: 3, label: "Marzo" },
        { value: 4, label: "Abril" },
        { value: 5, label: "Mayo" },
        { value: 6, label: "Junio" },
        { value: 7, label: "Julio" },
        { value: 8, label: "Agosto" },
        { value: 9, label: "Septiembre" },
        { value: 10, label: "Octubre" },
        { value: 11, label: "Noviembre" },
        { value: 12, label: "Diciembre" },
      ];
    },

    cards() {
      return [
        {
          title: "Ventas Totales",
          value: this.money(this.dashboard.kpis.total_sales),
        },
        {
          title: "Descuentos",
          value: this.money(this.dashboard.kpis.total_discount),
        },
        {
          title: "Órdenes",
          value: this.dashboard.kpis.total_orders,
        },
        {
          title: "Ticket Promedio",
          value: this.money(this.dashboard.kpis.avg_ticket),
        },
      ];
    },

    salesChartTitle() {
      const map = {
        day: "Ventas por día",
        week: "Ventas por semana",
        month: "Ventas por mes",
        year: "Ventas por año",
      };
      return map[this.filters.group_by] || "Ventas";
    },

    productsChartTitle() {
      const map = {
        day: "Productos más vendidos del día",
        week: "Productos más vendidos de la semana",
        month: "Productos más vendidos del mes",
        year: "Productos más vendidos del año",
      };
      return map[this.filters.group_by] || "Top productos vendidos";
    },

    salesSeries() {
      return [
        {
          name: "Ventas",
          data: this.dashboard.sales_by_period.map((x) => Number(x.total || 0)),
        },
      ];
    },

    salesChartOptions() {
      return {
        chart: {
          toolbar: { show: false },
        },
        colors: this.salesColors,
        xaxis: {
          categories: this.dashboard.sales_by_period.map((x) => x.period),
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          y: {
            formatter: (value) => this.money(value),
          },
        },
      };
    },

    categorySeries() {
      return this.dashboard.sales_by_category.map((x) => Number(x.total_sales || 0));
    },

    categoryChartOptions() {
      return {
        labels: this.dashboard.sales_by_category.map((x) => x.name),
        colors: this.categoryColors,
        legend: {
          position: "bottom",
        },
        tooltip: {
          y: {
            formatter: (value) => this.money(value),
          },
        },
        dataLabels: {
          formatter: (value, opts) => {
            const amount = this.categorySeries[opts.seriesIndex] || 0;
            return this.money(amount);
          },
        },
      };
    },

    topProductsSeries() {
      return [
        {
          name: "Cantidad",
          data: this.dashboard.top_products.map((x) => Number(x.total_quantity || 0)),
        },
      ];
    },

    topProductsOptions() {
      return {
        chart: {
          toolbar: { show: false },
        },
        colors: this.productColors,
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: this.dashboard.top_products.map((x) => x.name),
        },
        tooltip: {
          y: {
            formatter: (value) => `${value} unidades`,
          },
        },
      };
    },

    vendorsSeries() {
      return [
        {
          name: "Ventas",
          data: this.dashboard.sales_by_vendor.map((x) => Number(x.total_sales || 0)),
        },
      ];
    },

    vendorsOptions() {
      return {
        chart: {
          toolbar: { show: false },
        },
        colors: this.vendorColors,
        plotOptions: {
          bar: {
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: this.dashboard.sales_by_vendor.map((x) => x.name),
        },
        tooltip: {
          y: {
            formatter: (value) => this.money(value),
          },
        },
      };
    },
  },

  methods: {
    money(value) {
      return `S/. ${Number(value || 0).toFixed(2)}`;
    },

    handleFilterChange() {
      this.getDashboard();
    },

    resetFilters() {
      const today = new Date();
      this.filters = {
        group_by: "month",
        selected_date: today.toISOString().slice(0, 10),
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      };
      this.getDashboard();
    },

    buildParams() {
      return {
        group_by: this.filters.group_by,
        selected_date: this.filters.selected_date,
        year: this.filters.year,
        month: this.filters.month,
      };
    },

    async getDashboard() {
      this.loading = true;
      try {
        const response = await axios.get(url + "statistics/dashboard/", {
          params: this.buildParams(),
        });
        this.dashboard = response.data;
      } catch (error) {
        console.log("Error cargando dashboard", error);
      } finally {
        this.loading = false;
      }
    },
  },

  created() {
    this.getDashboard();
  },
});
</script>

<style scoped>
.stat-card,
.chart-card,
.filter-card {
  border: 1px solid var(--my-bc);
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
}
</style>