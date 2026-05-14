import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type ProductStat = {
  label: string;
  value: string;
  note: string;
  progress: number;
  progressClass: string;
};

type ProductItem = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  stockLabel: string;
  stockBarClass: string;
  status: string;
  statusClass: string;
  imageClass: string;
  accentClass: string;
};

type CategoryInsight = {
  title: string;
  items: string;
  revenue: string;
  accentClass: string;
};

type ChecklistItem = {
  title: string;
  description: string;
};

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css',
})
export class ProductManagement {
  readonly statusFilters = ['All products', 'Published', 'Draft', 'Low stock', 'Archived'];

  readonly overviewStats: ProductStat[] = [
    {
      label: 'Live catalog',
      value: '248',
      note: '18 added this week',
      progress: 72,
      progressClass: 'progress-bar--amber-pink',
    },
    {
      label: 'Inventory health',
      value: '94%',
      note: 'Healthy stock coverage',
      progress: 94,
      progressClass: 'progress-bar--emerald',
    },
    {
      label: 'Draft queue',
      value: '12',
      note: 'Need copy or media',
      progress: 38,
      progressClass: 'progress-bar--amber',
    },
    {
      label: 'Promo ready',
      value: '36',
      note: 'Prepared for campaign launch',
      progress: 58,
      progressClass: 'progress-bar--pink',
    },
  ];

  readonly products: ProductItem[] = [
    {
      name: 'AeroFlex Runner',
      sku: 'SNK-1042',
      category: 'Footwear',
      price: '$124.00',
      stock: 84,
      stockLabel: '84 units',
      stockBarClass: 'stock-bar--amber-pink',
      status: 'Published',
      statusClass: 'status-pill--published',
      imageClass: 'product-thumb--amber',
      accentClass: 'sku-pill--amber',
    },
    {
      name: 'Luna Carry Tote',
      sku: 'BAG-2088',
      category: 'Accessories',
      price: '$89.00',
      stock: 21,
      stockLabel: '21 units',
      stockBarClass: 'stock-bar--amber',
      status: 'Low stock',
      statusClass: 'status-pill--low',
      imageClass: 'product-thumb--pink',
      accentClass: 'sku-pill--pink',
    },
    {
      name: 'Noir Studio Lamp',
      sku: 'DEC-3190',
      category: 'Home decor',
      price: '$164.00',
      stock: 56,
      stockLabel: '56 units',
      stockBarClass: 'stock-bar--pink',
      status: 'Draft',
      statusClass: 'status-pill--draft',
      imageClass: 'product-thumb--rose',
      accentClass: 'sku-pill--rose',
    },
    {
      name: 'Terra Ceramic Set',
      sku: 'HOM-4412',
      category: 'Kitchen',
      price: '$74.00',
      stock: 132,
      stockLabel: '132 units',
      stockBarClass: 'stock-bar--emerald',
      status: 'Published',
      statusClass: 'status-pill--published',
      imageClass: 'product-thumb--emerald',
      accentClass: 'sku-pill--emerald',
    },
    {
      name: 'Atlas Travel Bottle',
      sku: 'LFS-5571',
      category: 'Lifestyle',
      price: '$32.00',
      stock: 9,
      stockLabel: '9 units',
      stockBarClass: 'stock-bar--rose',
      status: 'Archived',
      statusClass: 'status-pill--archived',
      imageClass: 'product-thumb--rose',
      accentClass: 'sku-pill--rose',
    },
  ];

  readonly categoryInsights: CategoryInsight[] = [
    {
      title: 'Footwear',
      items: '42 SKUs',
      revenue: '$18.4k this month',
      accentClass: 'insight-card__wash--amber',
    },
    {
      title: 'Accessories',
      items: '63 SKUs',
      revenue: '$11.2k this month',
      accentClass: 'insight-card__wash--pink',
    },
    {
      title: 'Home decor',
      items: '38 SKUs',
      revenue: '$9.8k this month',
      accentClass: 'insight-card__wash--emerald',
    },
  ];

  readonly checklist: ChecklistItem[] = [
    {
      title: 'Media approval',
      description: 'Review lifestyle photos and make sure each product has a primary cover image.',
    },
    {
      title: 'Pricing review',
      description: 'Check compare-at price, margin notes, and campaign discount rules before publishing.',
    },
    {
      title: 'Inventory sync',
      description: 'Confirm warehouse counts and reorder threshold values are updated for every active SKU.',
    },
  ];
}
