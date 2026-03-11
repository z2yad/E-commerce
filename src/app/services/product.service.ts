import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductResponse } from '@/interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  
  getallproducts(){
    const api_Url = 'https://dummyjson.com'
    const response = this.http.get<ProductResponse>(`${api_Url}/products`);
    return response;
  }
  getproductbyid(id:string){
    const api_Url = 'https://dummyjson.com'
    const response = this.http.get<ProductResponse>(`${api_Url}/products/${id}`);
    return response;
  }

}
