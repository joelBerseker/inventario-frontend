import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/home/Home.vue";
import Login from "../components/autentication/Login.vue";
import System from "../components/home/System.vue";
import Notification from "../components/notification/ListNotification.vue";
import Statistic from "../components/statistics/statistic.vue";
import Product from "../components/product/ListProduct.vue";
import AddProductExcel from "../components/product/AddProductExcel.vue";
import Supplier from "../components/supplier/ListSupplier.vue";
import Customer from "../components/customer/ListCustomer.vue";
import Inputs from "../components/input/ListInput.vue";
import Outputs from "../components/output/ListOutput.vue";
import About from "../components/about/about.vue";
import viewUser from "../components/user/viewUser.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "system",
      component: System,
      redirect: { name: "home" },
      children: [
        {
          path: "/user",
          name: "user",
          component: viewUser,
        },
        {
          path: "/notifications",
          name: "notifications",
          component: Notification,
        },
        {
          path: "/statistics",
          name: "statistics",
          component: Statistic,
        },
        {
          path: "/inputs",
          name: "inputs",
          component: Inputs,
        },
        {
          path: "/outputs",
          name: "outputs",
          component: Outputs,
        },
        {
          path: "/home",
          name: "home",
          component: Home,
        },
        {
          path: "/product",
          name: "product",
          component: Product,
        },
        {
          path: "/supplier",
          name: "supplier",
          component: Supplier,
        },
        {
          path: "/customer",
          name: "customer",
          component: Customer,
        },
        {
          path: "/about",
          name: "about",
          component: About,
        },
        {
          path: "/product/add-product-excel",
          name: "add-product-excel",
          component: AddProductExcel,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
  ],
});

export default router;
