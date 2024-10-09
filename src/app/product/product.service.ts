import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiURL = environment.apiURL + '/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(this.apiURL);
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURL}/${productId}`);
  }
}
