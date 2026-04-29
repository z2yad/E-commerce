import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../interfaces/product.interface';
import { AuthService } from '@/services/auth.service';
import { Order, OrderService } from '@/services/order.service';
import { UserProfile } from '@/interfaces/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

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
  private orderService = inject(OrderService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Expose wishlist signals
  wishlistItems = this.wishlistService.wishlistItems;
  wishlistCount = this.wishlistService.itemCount;
  wishlistTotal = this.wishlistService.totalValue;
  wishlistEmpty = this.wishlistService.isEmpty;

  user = signal<{
    name: string;
    email: string;
    avatar: string;
    joinedDate: string;
    orders: number;
  }>({
    name: '',
    email: '',
    avatar: 'https://i.pravatar.cc/150?u=lumina-profile',
    joinedDate: '',
    orders: 0,
  });
  orders = signal<Order[]>([]);

  activeTab = 'wishlist';

  ngOnInit() {
    const currentUser = this.authService.currentUser();

    forkJoin({
      profile: this.authService.getProfile(),
      orders: this.orderService.getMyOrders(20, 0),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ profile, orders }) => {
          this.user.set(this.mapProfile(profile.data));
          this.orders.set(orders.data);
          this.loading.set(false);
        },
        error: () => {
          this.user.set({
            name: currentUser?.name ?? 'My Account',
            email: currentUser?.email ?? '',
            avatar: currentUser?.avatar || 'https://i.pravatar.cc/150?u=lumina-profile',
            joinedDate: currentUser?.createdAt ? this.formatJoinedDate(currentUser.createdAt) : 'Unknown',
            orders: 0,
          });
          this.orders.set([]);
          this.loading.set(false);
        },
      });
  }

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

  private mapProfile(profile: UserProfile) {
    return {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar || 'https://i.pravatar.cc/150?u=lumina-profile',
      joinedDate: profile.createdAt ? this.formatJoinedDate(profile.createdAt) : 'Unknown',
      orders: profile.orderCount ?? 0,
    };
  }

  private formatJoinedDate(value: string): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  }
}
