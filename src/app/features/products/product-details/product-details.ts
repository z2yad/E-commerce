import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

private route = inject(ActivatedRoute); //استعملنا inject لانشاء instance من ActivatedRoute
productId = signal('');
ngOnInit(): void {
  this.route.params.subscribe((params) => {
    const id = params['id']
    this.productId.set(id);
  });
}
}