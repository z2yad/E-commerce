import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboard {
  activeTimeRange = signal('7D');

  stats = signal([
    { label: 'Total Revenue', value: '$124,500', growth: '+31.5%', type: 'up', color: 'amber' },
    { label: 'Active Users', value: '1,240', growth: '+22.7%', type: 'up', color: 'pink' },
    { label: 'Net Profit', value: '$45,200', growth: '+88', type: 'up', color: 'orange', suffix: 'this quarter' },
    { label: 'Conversion Rate', value: '3.8%', growth: '+11.2%', type: 'up', color: 'purple' },
  ]);

  recentOrders = signal([
    { id: '#8842', customer: 'Alex Rivera', product: 'Leather Wallet', amount: '$120', status: 'delivered', date: '2 mins ago' },
    { id: '#8841', customer: 'Sarah Chen', product: 'Premium Watch', amount: '$850', status: 'delivered', date: '15 mins ago' },
    { id: '#8840', customer: 'Marco V.', product: 'Designer Bag', amount: '$1,200', status: 'delivered', date: '1 hour ago' },
    { id: '#8839', customer: 'Elena G.', product: 'Silk Scarf', amount: '$250', status: 'pending', date: '3 hours ago' },
    { id: '#8838', customer: 'James T.', product: 'Tech Accessory', amount: '$45', status: 'cancelled', date: '5 hours ago' },
  ]);

  setTimeRange(range: string) {
    this.activeTimeRange.set(range);
  }
}
