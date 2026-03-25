import { ProductService } from '@/services/product.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, CommonModule, NgOptimizedImage } from '@angular/common';
import { Product, ProductResponse } from '@/interfaces/product.interface';
import { CartService } from '@/services/cart.service';
import { ToastService } from '@/services/toast.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '@/services/seo.service';

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
  Email_address = "ziadsalim121@gmail.com"
  //make a validation for the form
  ContactForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('Technical Support', [Validators.required]), // Added missing control
    message: new FormControl('', [Validators.required, Validators.minLength(10)]),
  })
  submitForm() {
    if (this.ContactForm.valid) {
      this.toastService.success('Thank you for your message. We will get back to you soon.');
      this.ContactForm.reset();
    } else {
      this.toastService.error('Please fill in all the fields');
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  scrollToContact() {
    window.scrollTo({
      top: document.getElementById('contact')?.offsetTop,
      behavior: 'smooth'
    });
  }
  scrollToProducts() {
    window.scrollTo({
      top: document.getElementById('products')?.offsetTop,
      behavior: 'smooth'
    });
  }
}
