import { Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  countItemsScroll = this.cartService.countItems;

  // two way binding with card and input
  name = '';
  cardnumber = '';
  cardexpiry = '';
  cardcvv = '';

  get formattedCardNumber() {
    if (!this.cardnumber) return '4242 •••• •••• 1337';
    // Format: 4 digits then space
    const cleaned = this.cardnumber.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  }

  get formattedExpiry() {
    return this.cardexpiry || '12/28';
  }

}
