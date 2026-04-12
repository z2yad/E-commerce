import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  
  // High-performance state using Signals
  private _currentUser = signal<User | null>(null);
  
  // Public accessors
  currentUser = this._currentUser.asReadonly();
  isLoggedIn = computed(() => !!this._currentUser());
  isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor() {
    // Basic Mock Persistence via LocalStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('luxury_user');
      if (savedUser) {
        try {
          this._currentUser.set(JSON.parse(savedUser));
        } catch (e) {
          console.error('Auth sync failed', e);
        }
      }
    }
  }

  // Mock Login Logic
  login(email: string, password: string): boolean {
    // 1. Check for hardcoded Admin (for testing)
    if (email === 'admin@luxury.com' && password === 'admin123') {
      const admin: User = { id: '0', email: 'admin@luxury.com', name: 'Admin Premium', role: 'admin' };
      this.setUser(admin);
      return true;
    }

    // 2. Check for regular users in mock storage
    const users: User[] = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const user = users.find(u => u.email === email);
    
    // In mock world, any valid email for a registered user works
    if (user) {
      this.setUser(user);
      return true;
    }

    return false;
  }

  register(name: string, email: string): boolean {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: 'user'
    };

    // Save to mock database
    const users: User[] = JSON.parse(localStorage.getItem('mock_users') || '[]');
    if (users.find(u => u.email === email)) return false; // Already exists

    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));
    
    // Auto login after register
    this.setUser(newUser);
    return true;
  }

  logout() {
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('luxury_user');
    }
  }

  private setUser(user: User) {
    this._currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('luxury_user', JSON.stringify(user));
    }
  }
}
