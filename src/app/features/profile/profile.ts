import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  loading = signal(true); // Toggle this to see the skeleton UI

  // Inject standard services safely
  wishlistService = inject(WishlistService);
  
  // Expose the signal so the template can read it
  wishlistItems = this.wishlistService.wishlistItems;

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

  // Placeholder functions for UI binding. User will implement logic.
  setTab(tab: string) {
    this.activeTab = tab;
  }

  removeFromWishlist(id: number | string) {
    this.wishlistService.removeFromWishlist(id);
  }

  addToCart(product: any) {
    // Handle cart logic
  }
}
