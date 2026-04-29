import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Router , RouterLink} from '@angular/router';
import { CartService } from '@/services/cart.service';
import { Product } from '@/interfaces/product.interface';
import { ToastService } from '@/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DecimalPipe,RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  cartItems = this.cartService.cart$;

  addItem(product: Product) {
    this.cartService.addItem(product);
    this.toastService.success('Product added to cart');
  }
  removeItem(id: string) {
    this.cartService.removeItem(id);
    this.toastService.success('Product removed from cart');
  }
  updateQuantity(id: string, quantity: number) {
    this.cartService.updateQuantity(id, quantity);
    this.toastService.success('Product quantity updated');
  }
  clearCart() {
    this.cartService.clearCart();
    this.toastService.error('Cart cleared');
  }

  getTotalPrice() {
    return this.cartService.getTotalPrice();
  }
  countItems() {
    return this.cartService.countItems();
  }
  removeAll() {
    this.cartService.clearCart();
    this.toastService.error('Cart cleared');
  }

  goToCheckout() {
    this.router.navigateByUrl('/checkout')
      .catch(error => console.error('Navigation error:', error));
  }

}
