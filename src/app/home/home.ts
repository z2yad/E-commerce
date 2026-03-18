import { ProductService } from '@/services/product.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, CommonModule } from '@angular/common';
import { ProductResponse } from '@/interfaces/product.interface';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DecimalPipe, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  protected readonly Math = Math;
  private productservice = inject(ProductService);
  products = this.productservice.allProducts;
  loading = this.productservice.loading;
  ngOnInit(): void {
    this.productservice.getallproducts().subscribe({
      next: (data: ProductResponse) => {
        this.products.set(data.products);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.loading.set(false);
      }
    })
  }
  totalProducts() {
    return this.products().length;
  }
}
