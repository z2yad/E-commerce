import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  loading = signal(true); // Toggle this to see the skeleton UI

  constructor() {
    // Simulate initial data loading
    setTimeout(() => {
      this.loading.set(false);
    }, 500);
  }

  // Mock data for UI rendering. User will handle actual logic later.
  user = {
    name: 'David Miller',
    email: 'alex.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=male-avatar-1',
    joinedDate: 'March 2026',
    orders: 12,
  };

  activeTab = 'wishlist'; // 'profile', 'orders', 'wishlist'

  wishlistItems = [
    {
      id: 1,
      title: 'Essence Mascara Lash Princess',
      price: 9.99,
      image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
      category: 'Beauty'
    },
    {
      id: 2,
      title: 'Eyeshadow Palette with Mirror',
      price: 19.99,
      image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
      category: 'Beauty'
    },
    {
      id: 3,
      title: 'Powder Canister',
      price: 14.99,
      image: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png',
      category: 'Beauty'
    }
  ];

  // Placeholder functions for UI binding. User will implement logic.
  setTab(tab: string) {
    this.activeTab = tab;
  }

  removeFromWishlist(id: number) {
    // User logic here
  }

  addToCart(product: any) {
    // User logic here
  }
}
