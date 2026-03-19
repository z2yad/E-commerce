import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ProductDetails } from './features/products/product-details/product-details';
import { Cart } from './cart/cart';
//client routes
export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'products',
        children: [
            {
                path: '',
                loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList),
                pathMatch: 'full'
            },
            {
                path: ':id',
                component: ProductDetails,
            }
        ]
    },
    {
        path: 'cart',
        component: Cart
    }
];
