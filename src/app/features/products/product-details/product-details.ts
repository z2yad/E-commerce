import { Product } from '@/interfaces/product.interface';
import { ProductService } from '@/services/product.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Loading } from "@/shared/components/loading/loading";

@Component({
  selector: 'app-product-details',
  imports: [Loading],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  protected readonly Math = Math;

  private route = inject(ActivatedRoute); //استعملنا inject لانشاء instance من ActivatedRoute
  productId = signal('');
  productService = inject(ProductService)
  product = signal<Product | null>(null);
  loading = signal<boolean>(this.productService.loading());
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id']
      this.productId.set(id);
    });
    this.productService.getproductbyid(this.productId()).subscribe({
      next: (data) => {
        this.product.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.loading.set(true)
      }
    })
  }
}