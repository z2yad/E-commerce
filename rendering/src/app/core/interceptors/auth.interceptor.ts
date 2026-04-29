import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * JWT Auth Interceptor (functional style for Angular 21)
 *
 * 1. Attaches `Authorization: Bearer <accessToken>` to every request
 *    targeting the Lumina API.
 * 2. On 401, attempts to refresh the access token once, then retries.
 * 3. On second 401 (or refresh failure), logs the user out and
 *    redirects to /login — compatible with the Angular authGuard.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Only intercept requests to our own API
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const token = authService.getAccessToken();
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint(req.url)) {
        // Attempt token refresh
        return authService.refreshAccessToken().pipe(
          switchMap((tokens) => {
            const retryReq = addToken(req, tokens.data.accessToken);
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Refresh failed — force logout
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

const addToken = (req: HttpRequest<unknown>, token: string): HttpRequest<unknown> =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

const isAuthEndpoint = (url: string): boolean =>
  url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh-token');
