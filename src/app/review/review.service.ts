import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // This ensures that the service is available application-wide
})
export class ReviewService {
  private baseUrl = environment.apiURL; // Update with your API URL

  constructor(private http: HttpClient) {}

  // Method to get reviews for a specific product by ID
  getReviews(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products/${productId}/reviews`);
  }

  // Method to add a review for a specific product
  addReview(productId: string, review: { rating: number; comment: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/${productId}/reviews`, review);
  }
}
