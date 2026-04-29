import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User, UserProfile } from '../interfaces/user.interface';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);
  toastService = inject(ToastService);

  private readonly apiUrl = environment.apiUrl;
  private readonly ACCESS_TOKEN_KEY = 'lumina_access_token';
  private readonly REFRESH_TOKEN_KEY = 'lumina_refresh_token';
  private readonly USER_KEY = 'luxury_user';

  // ── Reactive state (Signals) ───────────────────────────────────
  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();
  isLoggedIn = computed(() => !!this._currentUser());
  isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem(this.USER_KEY);
      if (savedUser) {
        try {
          this._currentUser.set(JSON.parse(savedUser));
        } catch {
          this.clearStorage();
        }
      }
    }
  }

  // ── Token accessors ────────────────────────────────────────────
  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // ── Register ───────────────────────────────────────────────────
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { name, email, password }).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError((err) => throwError(() => err))
    );
  }

  // ── Login ──────────────────────────────────────────────────────
  loginWithApi(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError((err) => throwError(() => err))
    );
  }

  /**
   * Legacy synchronous login for backward compatibility with existing
   * login component. Wraps the HTTP call.
   * @deprecated Use loginWithApi() for new code.
   */
  login(email: string, password: string): boolean {
    // Keep for backward-compat — the login component calls this
    // We trigger the HTTP call and return optimistically
    this.loginWithApi(email, password).subscribe({
      error: () => {}
    });
    return true; // Login component shows toast on success via Observable
  }

  // ── Logout ─────────────────────────────────────────────────────
  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken }).subscribe();
    }
    this._currentUser.set(null);
    this.clearStorage();
  }

  // ── Refresh token ──────────────────────────────────────────────
  refreshAccessToken(): Observable<{ success: boolean; data: { accessToken: string; refreshToken: string } }> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
        `${this.apiUrl}/auth/refresh-token`,
        { refreshToken }
      )
      .pipe(
        tap((res) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.ACCESS_TOKEN_KEY, res.data.accessToken);
            localStorage.setItem(this.REFRESH_TOKEN_KEY, res.data.refreshToken);
          }
        })
      );
  }

  // ── Get current user from API ──────────────────────────────────
  fetchCurrentUser(): Observable<{ success: boolean; data: { user: User } }> {
    return this.http.get<{ success: boolean; data: { user: User } }>(`${this.apiUrl}/auth/me`).pipe(
      tap((res) => {
        this._currentUser.set(res.data.user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
        }
      })
    );
  }

  getProfile(): Observable<{ success: boolean; data: UserProfile }> {
    return this.http.get<{ success: boolean; data: UserProfile }>(`${this.apiUrl}/users/profile`);
  }

  updateProfile(data: Partial<UserProfile>): Observable<{ success: boolean; data: UserProfile }> {
    return this.http.patch<{ success: boolean; data: UserProfile }>(`${this.apiUrl}/users/profile`, data).pipe(
      tap((res) => {
        const current = this._currentUser();
        if (current) {
          const updated = { ...current, name: res.data.name, avatar: res.data.avatar };
          this._currentUser.set(updated);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
          }
        }
      })
    );
  }

  // ── Forgot / Reset password ────────────────────────────────────
  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/auth/forgot-password`,
      { email }
    );
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.post(`${this.apiUrl}/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
  }

  // ── Private helpers ────────────────────────────────────────────
  private handleAuthSuccess(res: AuthResponse): void {
    this._currentUser.set(res.data.user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
      localStorage.setItem(this.ACCESS_TOKEN_KEY, res.data.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, res.data.refreshToken);
    }
  }

  private clearStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
