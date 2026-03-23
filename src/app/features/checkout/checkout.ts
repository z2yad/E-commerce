import { Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@/services/cart.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  countItemsScroll = this.cartService.countItems;

  // Reactive Form
  checkoutForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    country: new FormControl('EG', Validators.required),
    cardholdername: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cardnumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9\s]{13,19}$/)]),
    cardexpiry: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]),
    cardcvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
  });

  get nameOnCard() {
    return this.checkoutForm.get('cardholdername')?.value || 'CARD HOLDER';
  }

  get formattedCardNumber() {
    const val = this.checkoutForm.get('cardnumber')?.value;
    if (!val) return '4242 •••• •••• 1337';
    const cleaned = val.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  }

  get formattedExpiry() {
    return this.checkoutForm.get('cardexpiry')?.value || '12/28';
  }

  get cardcvv() {
    return this.checkoutForm.get('cardcvv')?.value || '999';
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.toastService.success('Order placed successfully');
      this.checkoutForm.reset();
      this.cartService.clearCart();
    } else {
      this.toastService.error('Please fill all the required fields correctly');
      this.checkoutForm.markAllAsTouched();
    }
  }
}
