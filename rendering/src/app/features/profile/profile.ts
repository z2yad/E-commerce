import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, RouterLink, DecimalPipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  loading = signal(true);
  saving = signal(false);
  editMode = signal(false);

  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

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

  profileData = signal<UserProfile | null>(null);
  orders = signal<Order[]>([]);
  activeTab = 'wishlist';

  // Mutable form object for ngModel two-way binding
  editFormData = {
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };

  ngOnInit() {
    const currentUser = this.authService.currentUser();

    forkJoin({
      profile: this.authService.getProfile(),
      orders: this.orderService.getMyOrders(20, 0),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ profile, orders }) => {
          this.profileData.set(profile.data);
          this.user.set(this.mapProfile(profile.data));
          this.orders.set(orders.data);
          this.loading.set(false);
        },
        error: () => {
          if (currentUser) {
            this.profileData.set(currentUser as UserProfile);
          }
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
    this.editMode.set(false);
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

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
    this.router.navigate(['/login']);
  }

  startEdit() {
    const p = this.profileData();
    this.editFormData = {
      name: p?.name ?? this.user().name,
      phone: p?.phone ?? '',
      street: p?.address?.street ?? '',
      city: p?.address?.city ?? '',
      state: p?.address?.state ?? '',
      zip: p?.address?.zip ?? '',
      country: p?.address?.country ?? '',
    };
    this.editMode.set(true);
  }

  cancelEdit() {
    this.editMode.set(false);
  }

  saveProfile() {
    if (!this.editFormData.name.trim()) {
      this.toastService.error('Name is required');
      return;
    }
    this.saving.set(true);
    const payload: Partial<UserProfile> = {
      name: this.editFormData.name.trim(),
      phone: this.editFormData.phone.trim() || undefined,
      address: {
        street: this.editFormData.street.trim() || undefined,
        city: this.editFormData.city.trim() || undefined,
        state: this.editFormData.state.trim() || undefined,
        zip: this.editFormData.zip.trim() || undefined,
        country: this.editFormData.country.trim() || undefined,
      },
    };

    this.authService.updateProfile(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.profileData.set(res.data);
          this.user.update(u => ({ ...u, name: res.data.name }));
          this.saving.set(false);
          this.editMode.set(false);
          this.toastService.success('Profile updated successfully');
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Failed to update profile');
        },
      });
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
