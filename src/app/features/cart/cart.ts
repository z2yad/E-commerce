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
  private tosatService = inject(ToastService);
  private router = inject(Router);
  cartItems = this.cartService.cart$;

  addItem(product: Product) {
    this.cartService.addItem(product);
    this.tosatService.success('Product added to cart');
  }
  removeItem(id: number) {
    this.cartService.removeItem(id);
    this.tosatService.success('Product removed from cart');
  }
  updateQuantity(id: number, quantity: number) {
    this.cartService.updateQuantity(id, quantity);
    this.tosatService.success('Product quantity updated');
  }
  clearCart() {
    this.cartService.clearCart();
    this.tosatService.error('Cart cleared');
  }

  getTotalPrice() {
    return this.cartService.getTotalPrice();
  }
  countItems() {
    return this.cartService.countItems();
  }
  removeAll() {
    this.cartService.clearCart();
    this.tosatService.error('Cart cleared');
  }

  goToCheckout() {
    console.log('Navigating to checkout...');
    this.router.navigateByUrl('/checkout')
      .then(success => console.log('Navigation success:', success))
      .catch(error => console.error('Navigation error:', error));
  }

}
