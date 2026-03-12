import { ProductService } from '@/services/product.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink,UpperCasePipe,TitleCasePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productservice = inject(ProductService);
  products = this.productservice.allProducts;
  product = this.productservice.getallproducts;
  ngOnInit(): void {
    this.productservice.getallproducts();
  }
}
