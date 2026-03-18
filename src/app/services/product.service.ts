import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Category, ProductQueryParams, ProductResponse } from '@/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  allProducts = signal<Product[]>([]);
  loading = signal<boolean>(true);

  private readonly api_Url = 'https://dummyjson.com';
  getallproducts(params?: ProductQueryParams) {
    this.loading.set(true);
    let url = `${this.api_Url}/products`;

    const queryParams: any = { ...params };

    if (queryParams.search) {
      url += `/search`;
      queryParams.q = queryParams.search;
      delete queryParams.search;
    } else if (queryParams.category) {
      url += `/category/${queryParams.category}`;
      delete queryParams.category;
    }

    return this.http.get<ProductResponse>(url, { params: queryParams });
  }

  getcategories() {
    return this.http.get<Category[]>(`${this.api_Url}/products/categories`);
  }

  getproductbyid(id: string) {
    return this.http.get<Product>(`${this.api_Url}/products/${id}`);
  }
}
