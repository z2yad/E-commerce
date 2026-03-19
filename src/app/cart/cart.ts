import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '@/services/cart.service';
import { Product } from '@/interfaces/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DecimalPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
cartService = inject(CartService);

cartItems = this.cartService.cart$;

addItem(product:Product){
  this.cartService.addItem(product);
}
removeItem(id:number){
  this.cartService.removeItem(id);
}
updateQuantity(id:number,quantity:number){
  this.cartService.updateQuantity(id,quantity);
}
clearCart(){
  this.cartService.clearCart();
}

getTotalPrice(){
  return this.cartService.getTotalPrice();
}
countItems(){
  return this.cartService.countItems();
}

}
