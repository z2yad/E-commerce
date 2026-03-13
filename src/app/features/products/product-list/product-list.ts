import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '@/services/product.service';
import { Loading } from "@/shared/components/loading/loading";
import { ProductResponse } from '@/interfaces/product.interface';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-product-list',
  imports: [Loading,RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  products = this.productService.allProducts;
  loading = this.productService.loading;
  ngOnInit() {
    this.productService.getallproducts().subscribe({
      next: (data: ProductResponse) => {
        setTimeout(() => {
          this.products.set(data.products);
          this.loading.set(false);
        }, 2000);
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.loading.set(false);
      }
    });
  }
}