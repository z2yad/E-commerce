import { Product } from '@/interfaces/product.interface';
import { ProductService } from '@/services/product.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Loading } from "@/shared/components/loading/loading";
import { DecimalPipe, NgOptimizedImage, DOCUMENT } from "@angular/common";
import { StatsCard } from "@/shared/components/stats-card/stats-card";
import { CartService } from '@/services/cart.service';
import { ToastService } from '@/services/toast.service';
import { SeoService } from '@/services/seo.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [Loading, NgOptimizedImage, DecimalPipe, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  protected readonly Math = Math;

  private route = inject(ActivatedRoute); //استعملنا inject لانشاء instance من ActivatedRoute
  productId = signal('');
  saveprice = signal<number>(0);
  discount = signal<number>(0);
  productService = inject(ProductService)
  product = signal<Product | null>(null);
  loading = signal<boolean>(this.productService.loading());
  error = signal<string | null>(null);
  selectedImage = signal<string>('');
  cartService = inject(CartService);
  tosatService = inject(ToastService);
  private seoService = inject(SeoService);
  private document = inject(DOCUMENT);
  additem(){
    const product = this.product();
    if (product) {
      this.cartService.addItem(product);
      this.tosatService.success('Product added to cart');
    }
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.productId.set(id);
        this.loading.set(true);
        this.productService.getproductbyid(id).subscribe({
          next: (data) => {
            this.product.set(data);
            if (data.thumbnail) {
              this.selectedImage.set(data.thumbnail);
            }
            this.saveprice.set(data.price * (data.discountPercentage! / 100));
            this.discount.set(data.price - this.saveprice());
            this.loading.set(false);

            // 1. Update Standard SEO Tags
            this.seoService.updateSeo({
              title: data.title,
              description: data.description,
              image: data.thumbnail,
              url: `https://e-commerce-iota-sand.vercel.app/products/${data.id}`
            });

            // 2. Inject JSON-LD Structured Data for Google Shopping
            const script = this.document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": data.title,
              "image": data.thumbnail,
              "description": data.description,
              "offers": {
                "@type": "Offer",
                "url": `https://e-commerce-iota-sand.vercel.app/products/${data.id}`,
                "priceCurrency": "USD",
                "price": data.price,
                "availability": data.stock! > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "itemCondition": "https://schema.org/NewCondition"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": data.rating,
                "reviewCount": 150
              }
            });
            script.className = 'structured-data-script';
            this.document.head.appendChild(script);
          },
          error: (err) => {
            console.error('Failed to load product', err);
            this.error.set('Failed to load product details.');
            this.loading.set(false);
          }
        });
      }
    });
  }
}