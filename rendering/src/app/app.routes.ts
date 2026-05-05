import { Router, Routes } from '@angular/router';
import { CartService } from './services/cart.service';
import { inject } from '@angular/core';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

// client routes with lazy loading for optimal performance
export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home').then(m => m.Home),
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
                loadComponent: () => import('./features/products/product-details/product-details').then(m => m.ProductDetails),
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboard)
            },
            {
                path: 'products',
                loadComponent: () => import('./features/admin/product-management/product-management').then(m => m.ProductManagement)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/admin/orders-management/orders-management').then(m => m.OrdersManagement)
            },
            {
                path: 'users',
                loadComponent: () => import('./features/admin/users-mangement/users-mangement').then(m => m.UsersManagement)
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/admin/settings/settings').then(m => m.Settings)
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ],
        canActivate: [adminGuard]
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart').then(m => m.Cart)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout),
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
        loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
        canActivate: [authGuard]
    },
    {
        path: 'privacy',
        loadComponent: () => import('./features/privacy/privacy').then(m => m.Privacy)
    },
    {
        path: 'terms',
        loadComponent: () => import('./features/terms/terms').then(m => m.Terms)
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
    },
];
