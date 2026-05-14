import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AdminService } from '../../../services/admin.service';

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentStatus?: string;
  items: Array<{
    product: any;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    phone?: string;
  };
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-management.html',
  styleUrl: './orders-management.css',
})
export class OrdersManagement implements OnInit {
  private adminService = inject(AdminService);
  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();

  // ── Data ─────────────────────────────────────────────────────────
  orders = signal<AdminOrder[]>([]);
  loading = signal(true);
  selectedOrder = signal<AdminOrder | null>(null);
  updatingStatus = signal(false);

  // ── Filter / search / sort ────────────────────────────────────────
  activeFilter = signal('All');
  searchQuery = signal('');
  searchInput = '';
  sortBy = signal<'newest' | 'oldest' | 'amount-asc' | 'amount-desc'>('newest');

  // ── Pagination ────────────────────────────────────────────────────
  currentPage = signal(1);
  filterTotal = signal(0);
  readonly limit = 15;
  readonly skeletonItems = [1, 2, 3, 4, 5];

  // ── Global stats (from dashboard endpoint) ────────────────────────
  globalTotal = signal(0);
  pendingCount = signal(0);
  deliveredOrders = signal(0);
  totalRevenue = signal(0);

  // ── Constants ─────────────────────────────────────────────────────
  readonly orderFilters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  readonly statusOptions: AdminOrder['status'][] = [
    'pending', 'processing', 'shipped', 'delivered', 'cancelled',
  ];
  readonly accentClasses = [
    'order-badge--amber',
    'order-badge--pink',
    'order-badge--rose',
    'order-badge--emerald',
    'order-badge--slate',
  ];

  // ── Computed ──────────────────────────────────────────────────────
  totalPages = computed(() => Math.max(1, Math.ceil(this.filterTotal() / this.limit)));

  deliveryRate = computed(() =>
    this.globalTotal() > 0
      ? Math.round((this.deliveredOrders() / this.globalTotal()) * 100)
      : 0
  );

  filteredOrders = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    let list = this.orders();
    if (q) {
      list = list.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.shippingAddress?.name?.toLowerCase().includes(q) ||
          o.shippingAddress?.phone?.includes(q)
      );
    }
    const sorted = [...list];
    switch (this.sortBy()) {
      case 'oldest':
        sorted.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        break;
      case 'amount-asc':
        sorted.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case 'amount-desc':
        sorted.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      default:
        sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return sorted;
  });

  overviewStats = computed(() => [
    {
      label: 'Total Orders',
      value: String(this.globalTotal() || this.filterTotal()),
      note: 'All time across all statuses',
      progress: Math.min(100, ((this.globalTotal() || this.filterTotal()) / 500) * 100),
      progressClass: 'order-progress--amber-pink',
    },
    {
      label: 'Pending Fulfillment',
      value: String(this.pendingCount()),
      note: 'Need packaging and labels',
      progress:
        this.globalTotal() > 0
          ? Math.round((this.pendingCount() / this.globalTotal()) * 100)
          : 0,
      progressClass: 'order-progress--amber',
    },
    {
      label: 'Delivery Rate',
      value: this.deliveryRate() + '%',
      note: 'Healthy delivery completion',
      progress: this.deliveryRate(),
      progressClass: 'order-progress--emerald',
    },
    {
      label: 'Total Revenue',
      value:
        this.totalRevenue() >= 1000
          ? '$' + (this.totalRevenue() / 1000).toFixed(1) + 'k'
          : '$' + this.totalRevenue().toFixed(0),
      note: 'Cumulative revenue',
      progress: Math.min(100, (this.totalRevenue() / 50000) * 100),
      progressClass: 'order-progress--pink',
    },
  ]);

  fulfillmentSteps = computed(() => {
    const status = this.selectedOrder()?.status ?? 'pending';
    const order = ['pending', 'processing', 'shipped', 'delivered'];
    const idx = order.indexOf(status);
    return [
      {
        title: 'Payment verified',
        description: 'Confirm payment status before creating shipment.',
        active: idx >= 0 && status !== 'cancelled',
      },
      {
        title: 'Warehouse packing',
        description: 'Prepare the items and print shipping label.',
        active: idx >= 1,
      },
      {
        title: 'Courier handoff',
        description: 'Assign carrier and update tracking link.',
        active: idx >= 2,
      },
      {
        title: 'Delivery confirmation',
        description: 'Close the order after successful delivery.',
        active: idx >= 3,
      },
    ];
  });

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => this.searchQuery.set(q));

    this.loadOrders();
    this.loadStats();
  }

  loadOrders() {
    this.loading.set(true);
    const status =
      this.activeFilter() === 'All' ? undefined : this.activeFilter().toLowerCase();

    this.adminService
      .getAdminOrders(this.currentPage(), this.limit, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          const raw = res?.data ?? res;
          const list: AdminOrder[] = Array.isArray(raw)
            ? raw
            : (raw?.orders ?? raw?.data ?? []);
          const total: number = res?.total ?? res?.data?.total ?? list.length;

          this.orders.set(list);
          this.filterTotal.set(total);

          if (!this.selectedOrder() && list.length > 0) {
            this.selectedOrder.set(list[0]);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  loadStats() {
    this.adminService
      .getDashboardStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const s = res?.data?.summary;
          if (s) {
            this.globalTotal.set(s.totalOrders ?? 0);
            this.pendingCount.set(s.pendingOrders ?? 0);
            this.deliveredOrders.set(s.deliveredOrders ?? 0);
            this.totalRevenue.set(s.totalRevenue ?? 0);
          }
        },
      });
  }

  setFilter(filter: string) {
    if (this.activeFilter() === filter) return;
    this.activeFilter.set(filter);
    this.currentPage.set(1);
    this.selectedOrder.set(null);
    this.loadOrders();
  }

  onSearchInput(value: string) {
    this.searchSubject.next(value);
  }

  selectOrder(order: AdminOrder) {
    this.selectedOrder.set(order);
  }

  updateStatus(newStatus: AdminOrder['status']) {
    const order = this.selectedOrder();
    if (!order || order.status === newStatus || this.updatingStatus()) return;
    this.updatingStatus.set(true);

    this.adminService
      .updateOrderStatus(order._id, newStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const updated = { ...order, status: newStatus };
          this.selectedOrder.set(updated);
          this.orders.update((list) =>
            list.map((o) => (o._id === order._id ? updated : o))
          );
          this.updatingStatus.set(false);
        },
        error: () => this.updatingStatus.set(false),
      });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadOrders();
  }

  // ── Display helpers ───────────────────────────────────────────────
  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatMoney(n: number): string {
    return '$' + (n ?? 0).toFixed(2);
  }

  itemCount(order: AdminOrder): string {
    const c = order.items?.length ?? 0;
    return c === 1 ? '1 item' : `${c} items`;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'order-pill--pending',
      processing: 'order-pill--processing',
      shipped: 'order-pill--shipped',
      delivered: 'order-pill--delivered',
      cancelled: 'order-pill--refunded',
    };
    return map[status?.toLowerCase()] ?? 'order-pill--pending';
  }

  paymentClass(status?: string): string {
    const map: Record<string, string> = {
      paid: 'order-pill--paid',
      pending: 'order-pill--pending',
      failed: 'order-pill--refunded',
      refunded: 'order-pill--refunded',
    };
    const key = status?.toLowerCase() ?? 'pending';
    return map[key] ?? 'order-pill--pending';
  }

  accentClass(index: number): string {
    return this.accentClasses[index % this.accentClasses.length];
  }

  orderShortId(order: AdminOrder): string {
    return (order.orderNumber ?? order._id ?? '').slice(-4) || '??';
  }

  productTitle(product: any): string {
    return typeof product === 'object' ? product?.title ?? 'Product' : 'Product';
  }

  lineTotal(item: { price: number; quantity: number }): string {
    return this.formatMoney((item.price ?? 0) * (item.quantity ?? 1));
  }

  isSelected(order: AdminOrder): boolean {
    return this.selectedOrder()?._id === order._id;
  }

  paymentMethodLabel(method?: string): string {
    return (method ?? '').replace(/_/g, ' ') || '—';
  }
}
