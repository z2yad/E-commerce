import { ProductService } from '@/services/product.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
private productservice=inject(ProductService);
product = this.productservice.getallproducts;
ngOnInit(): void {
  this.productservice.getallproducts();
}
}
