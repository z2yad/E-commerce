import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductResponse } from '@/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  allProducts = signal<Product[]>([]);
  loading = signal<boolean>(false);

  private readonly api_Url = 'https://dummyjson.com';
  getallproducts() {
    this.loading.set(true);
    this.http.get<ProductResponse>(`${this.api_Url}/products?limit=30`).subscribe({
      next: (data: ProductResponse) => {
        this.allProducts.set(data.products);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.loading.set(false);
      }
    });
  }
}
