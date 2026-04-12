import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '@/services/product.service';
import { Product, ProductQueryParams, ProductResponse } from '@/interfaces/product.interface';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { CartService } from '@/services/cart.service';
import { toast } from 'ngx-sonner';
import { ToastService } from '@/services/toast.service';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, NgOptimizedImage],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  protected readonly Math = Math;
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  searchParams = signal<string>('');
  categorySelected = signal<string>('');
  products = this.productService.allProducts;
  currentPage = signal<number>(1);
  totalPages = signal<number>(0);
  loading = this.productService.loading;
  error = signal<any>(null);
  cartService = inject(CartService);
  toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  additem(product: Product){
   if(!product){
    return;
   }
   this.cartService.addItem(product);
   this.toastService.success('Product added to cart');
  }
  ngOnInit() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      // Set values from URL to keep component state in sync
      if (params['page']) this.currentPage.set(Number(params['page']));
      if (params['search']) this.searchParams.set(params['search']);
      if (params['category']) this.categorySelected.set(params['category']);
      
      // Load products whenever query parameters change
      this.loadproducts();
    });
  }
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.updateQueryParams();
    }
  }
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((prev: number) => prev - 1);
      this.updateQueryParams();
    };
  }

  private updateQueryParams() {
    const params: Partial<ProductQueryParams> & { page: string } = {
      page: this.currentPage().toString()
    };
    if (this.searchParams()) params.search = this.searchParams();
    if (this.categorySelected()) params.category = this.categorySelected();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }
  loadproducts() {
    this.loading.set(true);
    this.error.set(null);

    const limit = 30;
    const skip = (this.currentPage() - 1) * limit;

    const params: ProductQueryParams = {
      limit: limit,
      skip: skip
    };

    if (this.searchParams()) params.search = this.searchParams();
    if (this.categorySelected()) params.category = this.categorySelected();

    this.productService.getallproducts(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: ProductResponse) => {
        // Correctly calculate total pages based on total records and limit
        const pages = Math.ceil(data.total / limit);

        // Simulating network delay as requested in previous logic
        setTimeout(() => {
          this.products.set(data.products);
          this.totalPages.set(pages);
          this.loading.set(false);
        }, 800);
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.error.set(err);
        this.loading.set(false);
      }
    });
  }
}


