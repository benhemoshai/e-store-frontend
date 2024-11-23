import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable, throwError } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiCartURL = `${environment.apiURL}/cart`;
  private apiCheckoutURL = `${environment.apiURL}/checkout`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Please log in to access your cart';
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred while processing your request';
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  addToCart(cartItem: CartItem): Observable<Product> {
    return this.http
      .post<Product>(this.apiCartURL, cartItem, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  removeFromCart(productId: string): Observable<void> {
    const url = `${this.apiCartURL}/${productId}`;
    return this.http
      .delete<void>(url, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  updateCartItem(cartItem: CartItem): Observable<CartItem> {
    const url = `${this.apiCartURL}/${cartItem.product._id}`;
    return this.http
      .put<CartItem>(url, cartItem, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http
      .get<CartItem[]>(this.apiCartURL, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  clearCart(): Observable<void> {
    return this.http
      .delete<void>(this.apiCartURL, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  checkOut(cartItems: CartItem[]): Observable<void> {
    return this.http
      .post<void>(this.apiCheckoutURL, cartItems, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }
}
