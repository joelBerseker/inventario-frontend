import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/home/Home.vue'
import Login from '../components/autentication/Login.vue'
import MainContainer from '../components/home/SideBar.vue'
import Product from '../components/product/ListProduct.vue'
import Supplier from '../components/supplier/ListSupplier.vue'
import Customer from '../components/customer/ListCustomer.vue'
import Inputs from '../components/Input/ListInput.vue'
import Outputs from '../components/Output/ListOutput.vue'
import About from '../components/about/about.vue'
import viewUser from '../components/user/viewUser.vue'
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
                    path: '/user',
                    name: 'user',
                    component: viewUser
                },
                {
                    path: '/inputs',
                    name: 'inputs',
                    component: Inputs
                },
                {
                    path: '/outputs',
                    name: 'outputs',
                    component: Outputs
                },
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
                },
                {
                    path: '/about',
                    name: 'about',
                    component: About
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

