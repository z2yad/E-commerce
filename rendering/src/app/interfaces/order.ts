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
