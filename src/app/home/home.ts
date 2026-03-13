import { ProductService } from '@/services/product.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe, CurrencyPipe } from '@angular/common';
import { ProductResponse } from '@/interfaces/product.interface';

@Component({
  selector: 'app-home',
  imports: [RouterLink, UpperCasePipe, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productservice = inject(ProductService);
  products = this.productservice.allProducts;
  loading = this.productservice.loading;
  product = this.productservice.getallproducts;
  productId = signal('');
  ngOnInit(): void {
    this.productservice.getallproducts().subscribe({
      next: (data: ProductResponse) => {
        setTimeout(() => {
          this.products.set(data.products);
          this.loading.set(false);
        }, 1000);
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.loading.set(false);
      }
    })
  }
}
