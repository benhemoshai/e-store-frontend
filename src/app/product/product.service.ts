import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseURL = environment.apiURL;
  apiURL = environment.apiURL + '/products';

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }

  // Fetch a single product by ID
  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURL}/${productId}`);
  }

  // Add a new product
  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.baseURL}/admin/products`, product, {
      withCredentials: true,
    });
  }

  // Update an existing product
  updateProduct(productId: string, product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.baseURL}/admin/products/${productId}`,
      product,
      {
        withCredentials: true, // Ensure session cookies are included
      }
    );
  }

  // Delete a product by ID
  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/admin/products/${productId}`, {
      withCredentials: true, // Ensure session cookies are included
    });
  }
}
