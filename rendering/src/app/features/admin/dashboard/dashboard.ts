import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink} from '@angular/router';
import { AdminService, DashboardData, StatCard, RecentOrder } from '@/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  activeTimeRange = signal('7D');
  loading = signal(true);
  error = signal<string | null>(null);

  stats = signal<StatCard[]>([
    { label: 'Total Revenue', value: '—', growth: '—', type: 'up', color: 'amber' },
    { label: 'Active Users', value: '—', growth: '—', type: 'up', color: 'pink' },
    { label: 'Total Orders', value: '—', growth: '—', type: 'up', color: 'orange' },
    { label: 'Products Listed', value: '—', growth: '—', type: 'up', color: 'purple' },
  ]);

  recentOrders = signal<RecentOrder[]>([]);
  summary = signal<DashboardData['summary'] | null>(null);

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res.data.stats);
        this.recentOrders.set(res.data.recentOrders);
        this.summary.set(res.data.summary);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load dashboard data. Please try again.');
        this.loading.set(false);
      },
    });
  }

  setTimeRange(range: string) {
    this.activeTimeRange.set(range);
  }
}
