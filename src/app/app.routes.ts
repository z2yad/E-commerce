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
import { NotFound } from './features/not-found/not-found';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';
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
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboard),
        canActivate: [adminGuard]
    },
    {
        path: 'cart',
        component: Cart
    },
    {
        path: 'checkout',
        component: Checkout,
        canActivate: [authGuard, () => {
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
        component: Profile,
        canActivate: [authGuard]
    },
    {
        path: 'privacy',
        component: Privacy
    },
    {
        path: 'terms',
        component: Terms
    },
    {
        path: '**',
        component: NotFound
    }
];
