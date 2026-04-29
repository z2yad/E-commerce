import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../interfaces/product.interface';

export interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  country: string;
}

export interface OrderItem {
  product: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod?: 'card' | 'cash_on_delivery' | 'paypal';
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  createdAt: string;
}

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
