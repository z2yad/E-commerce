import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type UserStat = {
  label: string;
  value: string;
  note: string;
  progress: number;
  progressClass: string;
};

type UserRow = {
  name: string;
  email: string;
  role: string;
  roleClass: string;
  status: string;
  statusClass: string;
  orders: string;
  spend: string;
  avatarClass: string;
};

type AccessCard = {
  title: string;
  description: string;
  accentClass: string;
};

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-mangement.html',
  styleUrl: './users-mangement.css',
})
export class UsersManagement {
  readonly userFilters = ['All users', 'Customers', 'Admins', 'VIP', 'Blocked'];

  readonly overviewStats: UserStat[] = [
    {
      label: 'Active users',
      value: '4.8k',
      note: 'Consistent weekly activity',
      progress: 84,
      progressClass: 'user-progress--amber-pink',
    },
    {
      label: 'New signups',
      value: '186',
      note: 'This week registrations',
      progress: 58,
      progressClass: 'user-progress--pink',
    },
    {
      label: 'VIP customers',
      value: '74',
      note: 'High-value segments',
      progress: 46,
      progressClass: 'user-progress--amber',
    },
    {
      label: 'Retention health',
      value: '91%',
      note: 'Strong returning customer rate',
      progress: 91,
      progressClass: 'user-progress--emerald',
    },
  ];

  readonly users: UserRow[] = [
    {
      name: 'Salma Fares',
      email: 'salma@demo.com',
      role: 'Customer',
      roleClass: 'user-pill--customer',
      status: 'Active',
      statusClass: 'user-pill--active',
      orders: '26 orders',
      spend: '$2,140',
      avatarClass: 'user-avatar--amber',
    },
    {
      name: 'Kareem Nabil',
      email: 'kareem@demo.com',
      role: 'Admin',
      roleClass: 'user-pill--admin',
      status: 'Online',
      statusClass: 'user-pill--online',
      orders: 'Internal',
      spend: 'Dashboard access',
      avatarClass: 'user-avatar--pink',
    },
    {
      name: 'Dina Mostafa',
      email: 'dina@demo.com',
      role: 'VIP',
      roleClass: 'user-pill--vip',
      status: 'Active',
      statusClass: 'user-pill--active',
      orders: '41 orders',
      spend: '$4,930',
      avatarClass: 'user-avatar--rose',
    },
    {
      name: 'Ahmed Samy',
      email: 'ahmed@demo.com',
      role: 'Customer',
      roleClass: 'user-pill--customer',
      status: 'Blocked',
      statusClass: 'user-pill--blocked',
      orders: '3 orders',
      spend: '$124',
      avatarClass: 'user-avatar--slate',
    },
  ];

  readonly accessCards: AccessCard[] = [
    {
      title: 'Admin roles',
      description: 'Manage dashboard permissions, view-only access, and action-based roles.',
      accentClass: 'access-wash--amber',
    },
    {
      title: 'Customer segments',
      description: 'Prepare cohorts for loyalty, retention, and promotional campaigns.',
      accentClass: 'access-wash--pink',
    },
    {
      title: 'Security review',
      description: 'Flag suspicious activity, reset sessions, and trigger identity checks.',
      accentClass: 'access-wash--emerald',
    },
  ];
}
