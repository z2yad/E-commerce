import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StatCard {
  label: string;
  value: string;
  growth: string;
  type: 'up' | 'down';
  color: string;
  suffix?: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
  date: string;
}

export interface DashboardData {
  stats: StatCard[];
  recentOrders: RecentOrder[];
  topProducts: any[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    pendingOrders: number;
    deliveredOrders: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getDashboardStats(): Observable<{ success: boolean; data: DashboardData }> {
    return this.http.get<{ success: boolean; data: DashboardData }>(`${this.apiUrl}/admin/stats`);
  }

  getSalesChart(days: number = 7): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(
      `${this.apiUrl}/admin/stats/sales`,
      { params: { days } }
    );
  }

  getAdminOrders(page = 1, limit = 20, status?: string): Observable<any> {
    const params: Record<string, any> = { page, limit };
    if (status) params['status'] = status;
    return this.http.get(`${this.apiUrl}/admin/orders`, { params });
  }

  getAdminUsers(page = 1, limit = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`, { params: { page, limit } });
  }

  // ── Product management ────────────────────────────────────────
  createProduct(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, data);
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // ── Category management ───────────────────────────────────────
  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, data);
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  // ── Order management ──────────────────────────────────────────
  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}/status`, { status });
  }

  // ── User management ───────────────────────────────────────────
  blockUser(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/block`, {});
  }

  unblockUser(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/unblock`, {});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
}
