import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable, throwError } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiCartURL = environment.apiURL + '/cart';
  private apiCheckoutURL = environment.apiURL + '/checkout';

  constructor(private http: HttpClient) { }

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

  addToCart(userId: string | null, cartItem: CartItem): Observable<Product> {
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    const url = `${this.apiCartURL}/${userId}`;
    return this.http.post<Product>(url, cartItem)
      .pipe(catchError(this.handleError));
  }

  removeFromCart(userId: string | null, productId: string): Observable<void> {
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    const url = `${this.apiCartURL}/${userId}/${productId}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.handleError));
  }

  updateCartItem(userId: string | null, cartItem: CartItem): Observable<CartItem> {
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    const url = `${this.apiCartURL}/${userId}/${cartItem.product._id}`;
    return this.http.put<CartItem>(url, cartItem)
      .pipe(catchError(this.handleError));
  }

  getCartItems(userId: string | null): Observable<CartItem[]> {
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    const url = `${this.apiCartURL}/${userId}`;
    return this.http.get<CartItem[]>(url)
      .pipe(catchError(this.handleError));
  }

  clearCart(userId: string | null): Observable<void> {
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    const url = `${this.apiCartURL}/${userId}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.handleError));
  }

  checkOut(userId: string | null, cartItems: CartItem[]): Observable<void> {
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    const url = `${this.apiCheckoutURL}/${userId}`;
    return this.http.post<void>(url, cartItems)
      .pipe(catchError(this.handleError));
  }
}