import { Injectable, signal, computed, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '@/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'luxury_wishlist';

  // Core reactive state with proper typing
  wishlistItems = signal<Product[]>([]);

  // Computed signals for derived state
  itemCount = computed(() => this.wishlistItems().length);
  totalValue = computed(() =>
    this.wishlistItems().reduce((sum, item) => sum + item.price, 0)
  );
  isEmpty = computed(() => this.wishlistItems().length === 0);

  constructor() {
    // Load from LocalStorage (SSR-safe)
    if (isPlatformBrowser(this.platformId)) {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            this.wishlistItems.set(parsed);
          }
        }
      } catch (e) {
        console.error('WishlistService: Failed to parse stored data', e);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }

    // Auto-persist on every change
    effect(() => {
      const items = this.wishlistItems();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      }
    });
  }

  addToWishlist(product: Product): boolean {
    if (this.isInWishlist(product.id)) {
      return false; // Already exists
    }
    this.wishlistItems.update(items => [...items, product]);
    return true;
  }

  removeFromWishlist(productId: number | string): boolean {
    const currentLength = this.wishlistItems().length;
    this.wishlistItems.update(items =>
      items.filter(item => Number(item.id) !== Number(productId))
    );
    return this.wishlistItems().length < currentLength;
  }

  toggleWishlist(product: Product): boolean {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
      return false; // Was removed
    } else {
      this.addToWishlist(product);
      return true; // Was added
    }
  }

  isInWishlist(productId: number | string): boolean {
    return this.wishlistItems().some(p => Number(p.id) === Number(productId));
  }

  clearWishlist(): void {
    this.wishlistItems.set([]);
  }
}
