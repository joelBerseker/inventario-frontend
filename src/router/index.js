import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/home/Home.vue'
import Product from '../components/product/ListProduct.vue'
import Supplier from '../components/supplier/ListSupplier.vue'
import Customer from '../components/customer/ListCustomer.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
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
        /*
        Por si a caso si se necesita xddxxddxxd
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
          }*/
    ]
})

export default router

