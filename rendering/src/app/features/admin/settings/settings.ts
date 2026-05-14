import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type SettingsStat = {
  label: string;
  value: string;
  note: string;
  progress: number;
  progressClass: string;
};

type SettingsGroup = {
  title: string;
  description: string;
  accentClass: string;
  fields: string[];
};

type SecurityItem = {
  title: string;
  description: string;
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  readonly sections = ['General', 'Payments', 'Notifications', 'Security', 'Advanced'];

  readonly overviewStats: SettingsStat[] = [
    {
      label: 'Store health',
      value: '98%',
      note: 'Core settings configured',
      progress: 98,
      progressClass: 'settings-progress--emerald',
    },
    {
      label: 'Pending updates',
      value: '05',
      note: 'Need admin review',
      progress: 34,
      progressClass: 'settings-progress--amber',
    },
    {
      label: 'Alert channels',
      value: '12',
      note: 'Email, SMS, dashboard events',
      progress: 64,
      progressClass: 'settings-progress--pink',
    },
    {
      label: 'Secure policies',
      value: '08',
      note: 'Protection and access rules',
      progress: 72,
      progressClass: 'settings-progress--amber-pink',
    },
  ];

  readonly groups: SettingsGroup[] = [
    {
      title: 'Store profile',
      description: 'Brand name, support contact, working hours, and storefront identity.',
      accentClass: 'settings-wash--amber',
      fields: ['Store name', 'Support email', 'Phone number'],
    },
    {
      title: 'Payment methods',
      description: 'Gateways, settlement rules, manual review, and refund preferences.',
      accentClass: 'settings-wash--pink',
      fields: ['Primary gateway', 'Refund rule', 'Currency display'],
    },
    {
      title: 'Automation rules',
      description: 'Order events, fulfillment alerts, customer notifications, and internal reminders.',
      accentClass: 'settings-wash--emerald',
      fields: ['Email events', 'SMS events', 'Admin alerts'],
    },
  ];

  readonly securityItems: SecurityItem[] = [
    {
      title: 'Two-factor access',
      description: 'Keep administrator access protected with a second verification step.',
    },
    {
      title: 'Session control',
      description: 'Expire unused sessions and force re-login after sensitive changes.',
    },
    {
      title: 'Audit history',
      description: 'Track who changed payment, shipping, or permission settings.',
    },
  ];
}
