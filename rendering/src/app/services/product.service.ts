import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product, Category, ProductQueryParams, ProductResponse } from '@/interfaces/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  allProducts = signal<Product[]>([]);
  loading = signal<boolean>(true);

  private readonly apiUrl = environment.apiUrl;
  private readonly apiAssetUrl = this.apiUrl.replace(/\/api\/v\d+\/?$/, '');

  private normalizeImageUrl(url?: string): string {
    if (!url) return '/assets/background.png';
    if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    if (url.startsWith('/uploads/')) {
      return `${this.apiAssetUrl}${url}`;
    }
    if (url.startsWith('uploads/')) {
      return `${this.apiAssetUrl}/${url}`;
    }
    return url;
  }

  private normalizeProduct(product: Product): Product {
    const rawImages = product.images?.length ? product.images : [product.thumbnail];
    const images = rawImages
      .map((image) => this.normalizeImageUrl(image))
      .filter((image): image is string => Boolean(image));
    const thumbnail = this.normalizeImageUrl(product.thumbnail || rawImages[0]);

    return {
      ...product,
      thumbnail,
      images: images.length ? images : [thumbnail],
    };
  }

  private normalizeProductResponse(response: ProductResponse): ProductResponse {
    return {
      ...response,
      products: response.products.map((product) => this.normalizeProduct(product)),
    };
  }

  /**
   * Returns ProductResponse: { products, total, skip, limit }
   * — same shape as dummyjson.com so ProductList and Home components work unchanged.
   */
  getallproducts(params?: ProductQueryParams) {
    this.loading.set(true);
    let url = `${this.apiUrl}/products`;
    const queryParams: Record<string, any> = {};

    if (params?.search) {
      queryParams['search'] = params.search;
    } else if (params?.category) {
      url += `/category/${params.category}`;
    }

    if (params?.limit !== undefined) queryParams['limit'] = params.limit;
    if (params?.skip !== undefined) queryParams['skip'] = params.skip;

    // Backend response shape: { success, products, total, skip, limit }
    // ProductResponse interface expects exactly: { products, total, skip, limit } ✅
    return this.http
      .get<ProductResponse>(url, { params: queryParams })
      .pipe(map((res) => this.normalizeProductResponse(res)));
  }

  /**
   * Returns Category[] — the backend wraps it in { success, data: [] }
   * so we map it to just the array to keep callers unchanged.
   */
  getcategories() {
    return this.http
      .get<{ success: boolean; data: Category[] }>(`${this.apiUrl}/products/categories`)
      .pipe(map((res) => res.data));
  }

  /**
   * Returns Product directly — maps from backend's { success, data: Product } envelope.
   * ProductDetails component does `this.product.set(data)` so we unwrap here.
   */
  getproductbyid(id: string) {
    return this.http
      .get<{ success: boolean; data: Product }>(`${this.apiUrl}/products/${id}`)
      .pipe(map((res) => this.normalizeProduct(res.data)));
  }
}
