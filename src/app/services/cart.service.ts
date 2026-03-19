import { CartItem, Product } from '@/interfaces/product.interface';
import { Injectable, PLATFORM_ID, inject, signal, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  
  // High-performance reactive state using Signals
  private _cartItems = signal<CartItem[]>([]);
  
  // Read-only accessors
  cartItems = this._cartItems.asReadonly();
  cart$ = toObservable(this._cartItems); // Compatibility for legacy RxJS parts

  // Automatic Totals using computed signals
  totalPrice = computed(() => 
    this._cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  countItems = computed(() => 
    this._cartItems().reduce((count, item) => count + item.quantity, 0)
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          this._cartItems.set(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse cart storage', e);
        }
      }
    }

    // Modern persistence: Automatically sync to storage on every change
    effect(() => {
      const items = this._cartItems();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('cart', JSON.stringify(items));
      }
    });
  }

  addItem(product: Product) {
    const items = this._cartItems();
    const existing = items.find(i => i.product.id === product.id);

    if (existing) {
      this._cartItems.set(
        items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this._cartItems.set([...items, { product, quantity: 1 }]);
    }
  }

  removeItem(id: number) {
    this._cartItems.set(
      this._cartItems().filter(item => item.product.id !== id)
    );
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }

    this._cartItems.set(
      this._cartItems().map(item =>
        item.product.id === id ? { ...item, quantity } : item
      )
    );
  }

  clearCart() {
    this._cartItems.set([]);
  }

  // Legacy compatibility methods (optional, but keep for convenience)
  getItems(): CartItem[] {
    return this._cartItems();
  }

  getTotalPrice(): number {
    return this.totalPrice();
  }

  getCount(): number {
    return this.countItems();
  }
}