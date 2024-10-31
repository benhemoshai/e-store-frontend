import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiCartURL = environment.apiURL + '/cart';
  private apiCheckoutURL = environment.apiURL + '/checkout';

  constructor(private http: HttpClient) { }

  addToCart(userId: string, cartItem: CartItem): Observable<Product> {
    const url = `${this.apiCartURL}/${userId}`;
    return this.http.post<Product>(url, cartItem);
  }

  removeFromCart(userId: string, productId: string): Observable<void> {
    const url = `${this.apiCartURL}/${userId}/${productId}`;
    return this.http.delete<void>(url);
  }

  updateCartItem(userId: string, cartItem: CartItem): Observable<CartItem> {
    const url = `${this.apiCartURL}/${userId}/${cartItem.product._id}`;
    return this.http.put<CartItem>(url, cartItem);
  }

  getCartItems(userId: string): Observable<CartItem[]> {
    const url = `${this.apiCartURL}/${userId}`;
    return this.http.get<CartItem[]>(url);
  }

  clearCart(userId: string): Observable<void> {
    const url = `${this.apiCartURL}/${userId}`;
    return this.http.delete<void>(url);
  }

  checkOut(userId: string, cartItems: CartItem[]): Observable<void> {
    const url = `${this.apiCheckoutURL}/${userId}`;
    return this.http.post<void>(url, cartItems);
  }
}
