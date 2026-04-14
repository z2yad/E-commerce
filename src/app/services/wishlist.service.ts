import { Injectable, signal, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private platformId = inject(PLATFORM_ID);

  // Modern Angular Signals state management
  wishlistItems = signal<any[]>([]);

  constructor() {
    // Initialize from LocalStorage safely (SSR Check)
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('luxury_wishlist');
      if (saved) {
        this.wishlistItems.set(JSON.parse(saved));
      }
    }

    // Effect auto-saves changes to LocalStorage
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('luxury_wishlist', JSON.stringify(this.wishlistItems()));
      }
    });
  }

  addToWishlist(product: any) {
    // Check if it already exists
    const exists = this.wishlistItems().some(p => p.id === product.id);
    if (!exists) {
      this.wishlistItems.update(items => [...items, product]);
    }
  }

  removeFromWishlist(productId: string | number) {
    this.wishlistItems.update(items => items.filter((item) => item.id !== productId));
  }

  isInWishlist(productId: string | number): boolean {
    return this.wishlistItems().some(p => p.id === productId);
  }
}
