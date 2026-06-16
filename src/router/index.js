import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/home/Home.vue";
import Login from "../components/autentication/Login.vue";
import ChangePassword from "../components/autentication/ChangePassword.vue";
import System from "../components/system/System.vue";
import Notification from "../components/notification/ListNotification.vue";
import Statistic from "../components/statistics/statistic.vue";
import Product from "../components/product/ProductList.vue";
import Category from "../components/Category/CategoryList.vue";
import AddProductExcel from "../components/product/ProductAddExcel.vue";
import Supplier from "../components/supplier/SupplierList.vue";
import Customer from "../components/customer/CustomerList.vue";
import Inputs from "../components/input/ListInput.vue";
import Outputs from "../components/output/ListOutput.vue";
import About from "../components/about/about.vue";
import viewUser from "../components/user/viewUser.vue";
import ListUsers from "../components/user/ListUsers.vue";
import AuthService from "@/services/AuthService";
import ExpenseList from "../components/finances/expenses/ExpenseList.vue";
import ExpenseCategoryList from "../components/finances/categories/ExpenseCategoryList.vue";
import FinancialDashboard from "../components/finances/FinancialDashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "system",
      component: System,
      redirect: { name: "home"},
      children: [
        {
          path: "/user",
          name: "user",
          component: viewUser,
          meta: { roles: ["admin", "seller"] },
        },
        {
          path: "/users",
          name: "users",
          component: ListUsers,
          meta: { roles: ["admin"] },
        },
        {
          path: "/notifications",
          name: "notifications",
          component: Notification,
          meta: { roles: ["admin"] },
        },
        {
          path: "/statistics",
          name: "statistics",
          component: Statistic,
          meta: { roles: ["admin"] },
        },
        {
          path: "/inputs",
          name: "inputs",
          component: Inputs,
          meta: { roles: ["admin"] },
        },
        {
          path: "/outputs",
          name: "outputs",
          component: Outputs,
          meta: { roles: ["admin", "seller"] },
        },
        {
          path: "/home",
          name: "home",
          component: Home,
          meta: { roles: ["admin", "seller"] },
        },
        {
          path: "/product",
          name: "product",
          component: Product,
          meta: { roles: ["admin"] },
        },
        {
          path: "/category",
          name: "category",
          component: Category,
          meta: { roles: ["admin"] },
        },
        {
          path: "/supplier",
          name: "supplier",
          component: Supplier,
          meta: { roles: ["admin"] },
        },
        {
          path: "/customer",
          name: "customer",
          component: Customer,
          meta: { roles: ["admin"] },
        },
        {
          path: "/about",
          name: "about",
          component: About,
          meta: { roles: ["admin", "seller"] },
        },
        {
          path: "/product/add-product-excel",
          name: "add-product-excel",
          component: AddProductExcel,
          meta: { roles: ["admin"] },
        },
        {
          path: "/expenses",
          name: "expenses",
          component: ExpenseList,
          meta: { roles: ["admin"] },
        },
        {
          path: "/expense-categories",
          name: "expense-categories",
          component: ExpenseCategoryList,
          meta: { roles: ["admin"] },
        },
        {
          path: "/financial-dashboard",
          name: "financial-dashboard",
          component: FinancialDashboard,
          meta: { roles: ["admin"] },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/change-password",
      name: "change-password",
      component: ChangePassword,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const loggedIn = AuthService.isLoggedIn();

  if (!loggedIn && to.name !== "login") {
    return next({ name: "login" });
  }

  let user = AuthService.getCurrentUser();

  if (loggedIn && !user && to.name !== "login") {
    try {
      user = await AuthService.getUser();
    } catch (error) {
      AuthService.logout();
      return next({ name: "login" });
    }
  }

  if (loggedIn && user?.must_change_password && to.name !== "change-password") {
    return next({ name: "change-password" });
  }

  if (loggedIn && to.name === "login") {
    if (!user) {
      try {
        user = await AuthService.getUser();
      } catch (error) {
        AuthService.logout();
        return next({ name: "login" });
      }
    }

    if (user?.must_change_password) {
      return next({ name: "change-password" });
    }

    const role =
      user?.is_superuser || user?.is_admin
        ? "admin"
        : user?.is_staff
          ? "seller"
          : "user";

    return next(role === "seller" ? { name: "outputs" } : { name: "home" });
  }

  if (!to.meta?.roles) {
    return next();
  }

  const role =
    user?.is_superuser || user?.is_admin
      ? "admin"
      : user?.is_staff
        ? "seller"
        : "user";

  if (to.meta.roles.includes(role)) {
    return next();
  }

  if (role === "seller") {
    return next({ name: "outputs" });
  }

  return next({ name: "home" });
});

export default router;
