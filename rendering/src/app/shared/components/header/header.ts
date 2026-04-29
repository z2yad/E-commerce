import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '@/services/product.service';
import { FormsModule } from '@angular/forms';
import { Category } from '@/interfaces/product.interface';

import { CommonModule } from '@angular/common';
import { CartService } from '@/services/cart.service';
import { AuthService } from '@/services/auth.service';
import { WishlistService } from '@/services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  searchParams = signal<string>('');
  categorySearch = signal<string>('');
  isMobileMenuOpen = signal<boolean>(false);
  categories = signal<Category[]>([]);
  cartService = inject(CartService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  
  countitems = computed(() => this.cartService.countItems());
  wishlistCount = this.wishlistService.itemCount;
  currentUser = computed(() => this.authService.currentUser());
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isAdmin = computed(() => this.authService.isAdmin());
  // Searchable categories logic
  filteredCategories = computed(() => {
    const search = this.categorySearch().toLowerCase();
    return this.categories().filter(cat => 
      cat.name.toLowerCase().includes(search) || 
      cat.slug.toLowerCase().includes(search)
    );
  });

  router = inject(Router);
  productService = inject(ProductService);

  ngOnInit() {
    this.productService.getcategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(prev => !prev);
  }

  onCategorySearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.categorySearch.set(target.value);
  }
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchParams.set(value);
    
    // We only need to navigate. The ProductList component will listen to queryParams
    // and call loadproducts() automatically due to the ngOnInit subscription there.
    this.router.navigate(['/products'], { 
      queryParams: { 
        search: value || null, // remove search param if empty
        page: 1 // reset to page 1 on new search
      },
      queryParamsHandling: 'merge'
    });
  }
}
