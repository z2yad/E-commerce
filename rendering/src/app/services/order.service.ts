import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../interfaces/product.interface';
import {
  CreateOrderDto,
  Order,
  OrderItem,
  ShippingAddress,
} from '../interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createOrder(dto: CreateOrderDto): Observable<{ success: boolean; data: Order; message: string }> {
    return this.http.post<{ success: boolean; data: Order; message: string }>(
      `${this.apiUrl}/orders`,
      dto
    );
  }

  getMyOrders(limit = 10, skip = 0): Observable<{ success: boolean; data: Order[]; total: number }> {
    return this.http.get<{ success: boolean; data: Order[]; total: number }>(
      `${this.apiUrl}/orders/my`,
      { params: { limit, skip } }
    );
  }

  getOrder(id: string): Observable<{ success: boolean; data: Order }> {
    return this.http.get<{ success: boolean; data: Order }>(`${this.apiUrl}/orders/${id}`);
  }

  /** Converts Angular CartItem[] to the API's OrderItem[] format */
  cartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
    }));
  }
}