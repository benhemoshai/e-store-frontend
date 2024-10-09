import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
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

  addToCart(cartItem: CartItem) : Observable<Product> {
    return this.http.post<Product>(this.apiCartURL,cartItem);
  }

  removeFromCart(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiCartURL}/${productId}`);
  }

  updateCartItem(cartItem: CartItem): Observable<CartItem> {
    // Use the product's _id instead of cartItem's _id
    return this.http.put<CartItem>(`${this.apiCartURL}/${cartItem.product._id}`, cartItem);
  }

  getCartItems() : Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiCartURL);
  }

  clearCart(): Observable<void>{
    return this.http.delete<void>(this.apiCartURL);
  }

  checkOut(cartItems: CartItem[]): Observable<void>{
    return this.http.post<void>(this.apiCheckoutURL,cartItems)
  }
}
