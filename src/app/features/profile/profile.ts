import { Component, signal, inject} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../interfaces/product.interface';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  loading = signal(true);

  // Services
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Expose wishlist signals
  wishlistItems = this.wishlistService.wishlistItems;
  wishlistCount = this.wishlistService.itemCount;
  wishlistTotal = this.wishlistService.totalValue;
  wishlistEmpty = this.wishlistService.isEmpty;

  constructor() {
    setTimeout(() => {
      this.loading.set(false);
    }, 500);
  }

  // Mock user data
  user = {
    name: 'David Miller',
    email: 'alex.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=male-avatar-1',
    joinedDate: 'March 2026',
    orders: 12,
  };

  activeTab = 'wishlist';

  setTab(tab: string) {
    this.activeTab = tab;
  }

  removeFromWishlist(id: number | string) {
    this.wishlistService.removeFromWishlist(id);
    this.toastService.success('Removed from wishlist');
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
    this.toastService.success('Added to cart');
  }

  clearWishlist() {
    this.wishlistService.clearWishlist();
    this.toastService.success('Wishlist cleared');
  }

  moveAllToCart() {
    const items = this.wishlistItems();
    items.forEach(item => this.cartService.addItem(item));
    this.wishlistService.clearWishlist();
    this.toastService.success(`${items.length} items moved to cart`);
  }
  //logout function
  logout(){
    this.authService.logout();
    this.toastService.success('Logged out successfully');
    this.router.navigate(['/login']);
  }
}
