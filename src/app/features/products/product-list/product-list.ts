import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '@/services/product.service';



@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  products = this.productService.allProducts;
  loading = this.productService.loading;
  ngOnInit(): void {
    this.productService.getallproducts();
  }
}