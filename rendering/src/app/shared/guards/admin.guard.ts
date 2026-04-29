import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Must be logged in AND have admin role
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // Redirect to home or a forbidden page if not admin
  return router.createUrlTree(['/']);
};
