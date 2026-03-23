import { Router, Routes } from '@angular/router';
import { Home } from './home/home';
import { ProductDetails } from './features/products/product-details/product-details';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';
import { CartService } from './services/cart.service';
import { inject } from '@angular/core';
import { Profile } from './features/profile/profile';
import { Terms } from './features/terms/terms';
import { Privacy } from './features/privacy/privacy';
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
    },
    {
        path: 'checkout',
        component: Checkout,
        canActivate: [() => {
            const cartService = inject(CartService);
            const router = inject(Router);

            const hasItems = cartService.cartItems().length > 0;

            if (hasItems) {
                return true;
            }

            return router.createUrlTree(['/cart']);
        }]
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path: 'privacy',
        component: Privacy
    },
    {
        path: 'terms',
        component: Terms
    }
];
