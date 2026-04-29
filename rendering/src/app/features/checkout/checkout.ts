import { Component, computed, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { CartService } from '@/services/cart.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@/services/toast.service';
import { OrderService } from '@/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  shippingFee = computed(() => (this.totalPrice() > 100 ? 0 : 9.99));
  taxAmount = computed(() => Math.round(this.totalPrice() * 0.08 * 100) / 100);
  grandTotal = computed(() =>
    Math.round((this.totalPrice() + this.shippingFee() + this.taxAmount()) * 100) / 100
  );
  countItemsScroll = this.cartService.countItems;
  submitting = signal(false);

  // Reactive Form — same fields as before
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
    cardnumber: new FormControl('', [Validators.required, Validators.pattern(/^[\d\s-]{13,19}$/)]),
    cardexpiry: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]),
    cardcvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
  });

  ngOnInit() {
    this.checkoutForm.get('cardnumber')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (value) {
          let cleaned = value.replace(/\D/g, '').substring(0, 16);
          let formatted = cleaned.match(/.{1,4}/g)?.join('-') || cleaned;
          if (value !== formatted) {
            this.checkoutForm.get('cardnumber')?.setValue(formatted, { emitEvent: false });
          }
        }
      });
  }

  get nameOnCard() {
    return this.checkoutForm.get('cardholdername')?.value || 'CARD HOLDER';
  }

  get formattedCardNumber() {
    const val = this.checkoutForm.get('cardnumber')?.value;
    if (!val) return '4242-••••-••••-1337';
    return val;
  }

  get formattedExpiry() {
    return this.checkoutForm.get('cardexpiry')?.value || '12/28';
  }

  get cardcvv() {
    return this.checkoutForm.get('cardcvv')?.value || '999';
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.toastService.error('Please fill all the required fields correctly');
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const v = this.checkoutForm.value;
    const orderPayload = {
      items: this.orderService.cartItemsToOrderItems(this.cartItems()),
      shippingAddress: {
        name: v.name!,
        email: v.email!,
        address: v.address!,
        city: v.city!,
        state: v.state!,
        zip: v.zip!,
        phone: v.phone!,
        country: v.country!,
      },
      paymentMethod: 'card' as const,
    };

    this.submitting.set(true);

    this.orderService.createOrder(orderPayload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.toastService.success(`Order ${res.data.orderNumber} placed successfully! 🎉`);
          this.checkoutForm.reset();
          this.cartService.clearCart();
          this.submitting.set(false);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Failed to place order. Please try again.';
          this.toastService.error(msg);
          this.submitting.set(false);
        },
      });
  }
}
