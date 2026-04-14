import { ProductService } from '@/services/product.service';
import { Component, inject, OnInit, signal, DestroyRef, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, CommonModule, NgOptimizedImage, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Product, ProductResponse } from '@/interfaces/product.interface';
import { CartService } from '@/services/cart.service';
import { ToastService } from '@/services/toast.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '@/services/seo.service';
import { WishlistService } from '@/services/wishlist.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DecimalPipe, CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private toastService = inject(ToastService);
  protected readonly Math = Math;
  private productservice = inject(ProductService);
  products = this.productservice.allProducts;
  loading = this.productservice.loading;
  cartService = inject(CartService);
  private seoService = inject(SeoService);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  private wishlistService = inject(WishlistService);
  
  toggleWishlist(product: Product) {
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
      this.toastService.success('Removed from wishlist');
    } else {
      this.wishlistService.addToWishlist(product);
      this.toastService.success('Added to wishlist');
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  
  additem(product: Product) {
    if (!product) {
      return;
    }
    this.cartService.addItem(product);
    this.toastService.success('Product added to cart');
  }
  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Elevate Your Everyday | Premium Fashion & Tech Shop',
      description: 'Transform your style with our curated collection of luxury cosmetics, apparel, and modern electronics. ✨ Fast shipping, secure checkout.',
      url: 'https://e-commerce-iota-sand.vercel.app/'
    });

    this.seoService.setJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are all lifestyle and tech products 100% authentic?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Every single product in our catalog—from luxury cosmetics to premium electronics—is sourced directly from authorized brand distributors with a verified authenticity guarantee."
          }
        },
        {
          "@type": "Question",
          "name": "What is your return policy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can return the item in its original condition for a full refund—no questions asked."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer free shipping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. We provide fast, free express shipping on all orders over $50. Once your order is processed, you will receive a tracking link to monitor your secure delivery."
          }
        }
      ]
    }, 'faq-schema-data');

    // Clean up SEO script on destroy
    this.destroyRef.onDestroy(() => {
      this.seoService.removeJsonLd('faq-schema-data');
    });

    this.productservice.getallproducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
  Email_address = "ziadsalim121@gmail.com"
  //make a validation for the form
  ContactForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('Technical Support', [Validators.required]), // Added missing control
    message: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
  })
  submitForm() {
    if (this.ContactForm.valid) {
      this.toastService.success('Thank you for your message. We will get back to you soon.');
      this.ContactForm.reset();
    } else {
      this.toastService.error('Please fill in all the fields');
    }
  }

  newsletterEmail = new FormControl('', [Validators.required, Validators.email]);

  subscribeNewsletter() {
    if (this.newsletterEmail.valid) {
      this.toastService.success('Successfully subscribed to our newsletter!');
      this.newsletterEmail.reset();
      this.newsletterEmail.markAsPristine();
    } else {
      this.toastService.error('Please enter a valid email address');
      this.newsletterEmail.markAsTouched();
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  scrollToContact() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: document.getElementById('contact')?.offsetTop,
        behavior: 'smooth'
      });
    }
  }
  scrollToProducts() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: document.getElementById('products')?.offsetTop,
        behavior: 'smooth'
      });
    }
  }
}
