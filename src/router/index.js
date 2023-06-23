import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/home/Home.vue'
import Login from '../components/autentication/Login.vue'
import MainContainer from '../components/home/SideBar.vue'
import Product from '../components/product/ListProduct.vue'
import Supplier from '../components/supplier/ListSupplier.vue'
import Customer from '../components/customer/ListCustomer.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'main_container',
            component: MainContainer,
            redirect: {name: 'home'}, 
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: Home
                },
                {
                    path: '/product',
                    name: 'product',
                    component: Product
                },
                {
                    path: '/supplier',
                    name: 'supplier',
                    component: Supplier
                },
                {
                    path: '/customer',
                    name: 'customer',
                    component: Customer
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})

export default router

