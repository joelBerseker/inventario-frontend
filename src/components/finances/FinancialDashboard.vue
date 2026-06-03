<template>
  <SystemContent :loading="loading">
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

          <div class="col-12 col-md-3" v-if="filters.group_by === 'day' || filters.group_by === 'week'">
            <label class="form-label">Fecha base</label>
            <input
              type="date"
              class="form-control form-control-sm"
              v-model="filters.selected_date"
              @change="handleFilterChange"
            />
          </div>

          <div class="col-12 col-md-3" v-if="filters.group_by === 'month' || filters.group_by === 'year'">
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

          <div class="col-12 col-md-3">
            <button class="btn btn-outline-secondary btn-sm w-100" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise"></i>
              Resetear filtros
            </button>
          </div>
        </div>
      </div>
    </div>

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

    <div class="row mb-3">
      <div class="col-12 col-lg-8">
        <div class="card mb-3 chart-card">
          <div class="card-body">
            <p class="title-text mb-3">{{ salesChartTitle }}</p>
            <apexchart type="bar" height="320" :options="salesOptions" :series="salesSeries" />
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card mb-3 chart-card">
          <div class="card-body">
            <p class="title-text mb-3">Gastos por categoría</p>
            <apexchart type="donut" height="320" :options="expensesCategoryOptions" :series="expensesCategorySeries" />
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-12 col-lg-6">
        <div class="card mb-3 chart-card">
          <div class="card-body">
            <p class="title-text mb-3">{{ expensesChartTitle }}</p>
            <apexchart type="bar" height="320" :options="expensesPeriodOptions" :series="expensesPeriodSeries" />
          </div>
        </div>
      </div>
           <div class="col-12 col-lg-6">
        <div class="card mb-3 chart-card">
          <div class="card-body">
            <p class="title-text mb-3">Descuentos por vendedor</p>
            <apexchart type="bar" height="340" :options="discountsVendorOptions" :series="discountsVendorSeries" />
          </div>
        </div>
      </div>
 
    </div>
  </SystemContent>
</template>

<script>
import { defineComponent } from "vue";
import SystemContent from "@/components/system/SystemContent.vue";
import ConectionExpense from "@/mixin/conections/ConectionExpense";

export default defineComponent({
  name: "FinancialDashboard",
  mixins: [ConectionExpense],
  components: { SystemContent },
  props: ["changeTopbar"],
  data() {
    const today = new Date();
    return {
      loading: false,
      topbar: {
        title: "Dashboard Financiero",
        icon: "bi bi-graph-up-arrow",
        breadcrumb: [
          { name: "Inicio", link: "/home" },
          { name: "Dashboard Financiero", link: "" },
        ],
      },
      filters: {
        group_by: "month",
        selected_date: today.toISOString().slice(0, 10),
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      },
      dashboard: {
        meta: {},
        kpis: {
          total_sales: 0,
          total_discount: 0,
          total_orders: 0,
          avg_ticket: 0,
          total_expenses: 0,
          total_expense_count: 0,
          profit_total: 0,
        },
        sales_by_period: [],
        expenses_by_period: [],
        expenses_by_category: [],
        sales_by_vendor: [],
        discounts_by_vendor: [],
        top_products: [],
      },
      salesColors: ["#2563EB"],
      expenseColors: ["#EF4444"],
      categoryColors: ["#8B5CF6", "#F59E0B", "#10B981", "#EC4899", "#06B6D4", "#6366F1", "#F97316"],
      vendorColors: ["#14B8A6"],
      discountColors: ["#E11D48"],
      productColors: ["#F97316"],
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
        { title: "Ventas", value: this.money(this.dashboard.kpis.total_sales) },
        { title: "Gastos", value: this.money(this.dashboard.kpis.total_expenses) },
        { title: "Utilidad", value: this.money(this.dashboard.kpis.profit_total) },
        { title: "Descuentos", value: this.money(this.dashboard.kpis.total_discount) },
      ];
    },

    salesChartTitle() {
      const map = {
        day: "Ingresos del día",
        week: "Ingresos de la semana",
        month: "Ingresos del mes",
        year: "Ingresos del año",
      };
      return map[this.filters.group_by] || "Ingresos";
    },

    expensesChartTitle() {
      const map = {
        day: "Gastos del día",
        week: "Gastos de la semana",
        month: "Gastos del mes",
        year: "Gastos del año",
      };
      return map[this.filters.group_by] || "Gastos";
    },

 

    salesSeries() {
      return [
        {
          name: "Ingresos",
          data: this.dashboard.sales_by_period.map((x) => Number(x.total || 0)),
        },
      ];
    },

    salesOptions() {
      return {
        chart: { toolbar: { show: false } },
        colors: this.salesColors,
        xaxis: {
          categories: this.dashboard.sales_by_period.map((x) => x.period),
        },
        dataLabels: { enabled: false },
        tooltip: {
          y: {
            formatter: (value) => this.money(value),
          },
        },
      };
    },

    expensesPeriodSeries() {
      return [
        {
          name: "Gastos",
          data: this.dashboard.expenses_by_period.map((x) => Number(x.total || 0)),
        },
      ];
    },

    expensesPeriodOptions() {
      return {
        chart: { toolbar: { show: false } },
        colors: this.expenseColors,
        xaxis: {
          categories: this.dashboard.expenses_by_period.map((x) => x.period),
        },
        dataLabels: { enabled: false },
        tooltip: {
          y: {
            formatter: (value) => this.money(value),
          },
        },
      };
    },

    expensesCategorySeries() {
      return this.dashboard.expenses_by_category.map((x) => Number(x.total || 0));
    },

    expensesCategoryOptions() {
      return {
        labels: this.dashboard.expenses_by_category.map((x) => x.name),
        colors: this.categoryColors,
        legend: { position: "bottom" },
        tooltip: {
          y: {
            formatter: (value) => this.money(value),
          },
        },
        dataLabels: {
          formatter: (value, opts) => {
            const amount = this.expensesCategorySeries[opts.seriesIndex] || 0;
            return this.money(amount);
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
        chart: { toolbar: { show: false } },
        colors: this.vendorColors,
        dataLabels: { enabled: false },
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

    discountsVendorSeries() {
      return [
        {
          name: "Descuentos",
          data: this.dashboard.discounts_by_vendor.map((x) => Number(x.total_discount || 0)),
        },
      ];
    },

    discountsVendorOptions() {
      return {
        chart: { toolbar: { show: false } },
        colors: this.discountColors,
        plotOptions: {
          bar: {
            borderRadius: 4,
          },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: this.dashboard.discounts_by_vendor.map((x) => x.name),
        },
        tooltip: {
          y: {
            formatter: (value) => this.money(value),
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
        chart: { toolbar: { show: false } },
        colors: this.productColors,
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4,
          },
        },
        dataLabels: { enabled: false },
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
  },
  methods: {
    money(value) {
      return `S/. ${Number(value || 0).toFixed(2)}`;
    },

    buildParams() {
      return {
        group_by: this.filters.group_by,
        selected_date: this.filters.selected_date,
        year: this.filters.year,
        month: this.filters.month,
      };
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

    async getDashboard() {
      this.loading = true;
      const response = await this.getFinancialDashboard(this.buildParams());
      if (response.success) {
        this.dashboard = response.response.data;
      }
      this.loading = false;
    },
  },
  created() {
    if (this.changeTopbar) this.changeTopbar(this.topbar);
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